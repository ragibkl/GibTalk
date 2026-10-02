package expo.modules.gibtalkvoices

import android.content.Intent
import android.speech.tts.TextToSpeech
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.util.Locale

// Tells the app which languages the device can really speak. expo-speech's
// voice list includes voices the engine offers but hasn't downloaded, and
// expo-speech silently falls back to the default language for those.
class GibtalkVoicesModule : Module() {
  private var tts: TextToSpeech? = null
  private var ready = false
  private val pending = mutableListOf<(TextToSpeech?) -> Unit>()

  private fun withTts(block: (TextToSpeech?) -> Unit) {
    val current = tts
    if (current != null && ready) {
      block(current)
      return
    }
    pending.add(block)
    if (current == null) {
      val context = appContext.reactContext ?: run {
        pending.toList().forEach { it(null) }
        pending.clear()
        return
      }
      tts = TextToSpeech(context) { status ->
        ready = status == TextToSpeech.SUCCESS
        val engine = if (ready) tts else null
        pending.toList().forEach { it(engine) }
        pending.clear()
      }
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

  override fun definition() = ModuleDefinition {
    Name("GibtalkVoices")

    OnDestroy {
      tts?.shutdown()
      tts = null
      ready = false
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
