package expo.modules.gibtalkvoices

import android.content.Intent
import android.speech.tts.TextToSpeech
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.Locale
import java.util.concurrent.atomic.AtomicReference

// The app's text-to-speech on Android: speaks words, and tells the app which
// languages the device can really speak. expo-speech's voice list includes
// voices the engine offers but hasn't downloaded, and expo-speech never
// reconnects: if the engine is stopped while the app is open (a phone
// cleaner, an engine update), every word after that is silent until the app
// is restarted.
class GibtalkVoicesModule : Module() {
  private var tts: TextToSpeech? = null
  private var ready = false
  private val pending = mutableListOf<(TextToSpeech?) -> Unit>()
  private var nextId = 0
  private var generation = 0

  // Runs `block` with a connected engine, or null if there is none. A failed
  // connection is dropped, so the next call tries again.
  private fun withTts(block: (TextToSpeech?) -> Unit) {
    val runNow: TextToSpeech?
    synchronized(this) {
      val current = tts
      if (current != null && ready) {
        runNow = current
      } else {
        pending.add(block)
        if (current == null) connect()
        return
      }
    }
    block(runNow)
  }

  // Call with the lock held. The engine can answer during the constructor
  // (when it can't bind at all) or later on another thread.
  private fun connect() {
    val context = appContext.reactContext
    if (context == null) {
      finishPending(null)
      return
    }
    val gen = ++generation
    val instance = AtomicReference<TextToSpeech?>(null)
    var earlyStatus: Int? = null
    val created = TextToSpeech(context) { status ->
      val engine = instance.get()
      if (engine == null) earlyStatus = status else onInit(gen, engine, status)
    }
    instance.set(created)
    tts = created
    earlyStatus?.let { onInit(gen, created, it) }
  }

  private fun onInit(gen: Int, engine: TextToSpeech, status: Int) {
    val connected: TextToSpeech?
    synchronized(this) {
      // A newer connection replaced this one.
      if (gen != generation) {
        engine.shutdown()
        return
      }
      ready = status == TextToSpeech.SUCCESS
      if (!ready) {
        engine.shutdown()
        tts = null
      }
      connected = if (ready) engine else null
    }
    finishPending(connected)
  }

  private fun finishPending(engine: TextToSpeech?) {
    val waiting: List<(TextToSpeech?) -> Unit>
    synchronized(this) {
      waiting = pending.toList()
      pending.clear()
    }
    waiting.forEach { it(engine) }
  }

  // Drop the engine connection; the next call makes a new one.
  private fun disconnect() {
    synchronized(this) {
      generation++
      tts?.shutdown()
      tts = null
      ready = false
    }
  }

  // Language code as the app stores it: "ms", "id", "zh" (toLanguageTag maps
  // Java's legacy "in" back to "id").
  private fun codeOf(locale: Locale): String = locale.toLanguageTag().substringBefore('-')

  private fun nameOf(code: String): Map<String, String> {
    val locale = Locale.forLanguageTag(code)
    val native = locale.getDisplayLanguage(locale).replaceFirstChar { it.uppercase(locale) }
    val local = locale.getDisplayLanguage(Locale.getDefault()).replaceFirstChar { it.uppercase() }
    return mapOf("code" to code, "name" to native, "localName" to local)
  }

  private fun installedCodes(engine: TextToSpeech): Set<String> {
    val voices = try { engine.voices } catch (e: Exception) { null } ?: return emptySet()
    return voices
      .filter { voice ->
        !voice.features.contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED) &&
          !voice.isNetworkConnectionRequired
      }
      .map { codeOf(it.locale) }
      .filter { it.isNotEmpty() && it != "und" }
      .toSet()
  }

  // Queues `text` in `language`, or the device's language if that one has no
  // voice (as expo-speech did). Returns false if the engine refused it.
  private fun speakOn(engine: TextToSpeech, text: String, language: String): Boolean {
    val locale = Locale(language)
    val available = engine.isLanguageAvailable(locale)
    engine.language =
      if (available == TextToSpeech.LANG_MISSING_DATA || available == TextToSpeech.LANG_NOT_SUPPORTED) {
        Locale.getDefault()
      } else {
        locale
      }
    val id = synchronized(this) { "gibtalk-${nextId++}" }
    return engine.speak(text, TextToSpeech.QUEUE_ADD, null, id) == TextToSpeech.SUCCESS
  }

  override fun definition() = ModuleDefinition {
    Name("GibtalkVoices")

    OnDestroy {
      disconnect()
    }

    // Says `text`. If the engine was stopped or never connected, connects
    // again and retries once. Resolves false if it still can't speak.
    AsyncFunction("speak") { text: String, language: String, promise: Promise ->
      withTts { engine ->
        if (engine != null && speakOn(engine, text, language)) {
          promise.resolve(true)
          return@withTts
        }
        disconnect()
        withTts { retry ->
          promise.resolve(retry != null && speakOn(retry, text, language))
        }
      }
    }

    AsyncFunction("stop") {
      synchronized(this@GibtalkVoicesModule) { if (ready) tts else null }?.stop()
    }

    // "ready", "no-engine" (no text-to-speech engine, or it won't start) or
    // "no-voices" (an engine with no voices at all).
    AsyncFunction("getSpeechStatus") { promise: Promise ->
      withTts { engine ->
        val voices = try { engine?.voices } catch (e: Exception) { null }
        promise.resolve(
          when {
            engine == null -> "no-engine"
            voices.isNullOrEmpty() -> "no-voices"
            else -> "ready"
          }
        )
      }
    }

    // Languages with an offline voice on this device.
    AsyncFunction("getInstalledLanguages") { promise: Promise ->
      withTts { engine ->
        if (engine == null) {
          promise.resolve(emptyList<Map<String, String>>())
        } else {
          promise.resolve(installedCodes(engine).sorted().map { nameOf(it) })
        }
      }
    }

    // "ready", "missing" (can be downloaded) or "unsupported".
    AsyncFunction("getLanguageStatus") { code: String, promise: Promise ->
      withTts { engine ->
        if (engine == null) {
          promise.resolve("unsupported")
        } else if (installedCodes(engine).contains(code)) {
          promise.resolve("ready")
        } else {
          val result = engine.isLanguageAvailable(Locale.forLanguageTag(code))
          promise.resolve(if (result == TextToSpeech.LANG_NOT_SUPPORTED) "unsupported" else "missing")
        }
      }
    }

    AsyncFunction("getLanguageName") { code: String ->
      nameOf(code)
    }

    // Opens the engine's voice download screen, or the system TTS settings.
    AsyncFunction("openVoiceSettings") {
      val context = appContext.reactContext ?: return@AsyncFunction false
      val intents = listOf(
        Intent(TextToSpeech.Engine.ACTION_INSTALL_TTS_DATA),
        Intent("com.android.settings.TTS_SETTINGS")
      )
      for (intent in intents) {
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        try {
          context.startActivity(intent)
          return@AsyncFunction true
        } catch (e: Exception) {
          // try the next one
        }
      }
      false
    }
  }
}
