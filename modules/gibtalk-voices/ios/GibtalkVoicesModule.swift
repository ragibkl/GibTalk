import AVFoundation
import ExpoModulesCore

public class GibtalkVoicesModule: Module {
  private func codeOf(_ language: String) -> String {
    return String(language.split(separator: "-").first ?? "")
  }

  private func nameOf(_ code: String) -> [String: String] {
    let native = Locale(identifier: code).localizedString(forLanguageCode: code) ?? code
    let local = Locale.current.localizedString(forLanguageCode: code) ?? code
    return ["code": code, "name": native.capitalized, "localName": local.capitalized]
  }

  private func installedCodes() -> Set<String> {
    return Set(AVSpeechSynthesisVoice.speechVoices().map { codeOf($0.language) }.filter { !$0.isEmpty })
  }

  public func definition() -> ModuleDefinition {
    Name("GibtalkVoices")

    AsyncFunction("getInstalledLanguages") { () -> [[String: String]] in
      return installedCodes().sorted().map { nameOf($0) }
    }

    AsyncFunction("getLanguageStatus") { (code: String) -> String in
      return installedCodes().contains(code) ? "ready" : "missing"
    }

    AsyncFunction("getLanguageName") { (code: String) -> [String: String] in
      return nameOf(code)
    }

    // iOS has no link to the voice download screen; the app shows the steps.
    AsyncFunction("openVoiceSettings") { () -> Bool in
      return false
    }
  }
}
