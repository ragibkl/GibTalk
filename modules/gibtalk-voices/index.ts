import { requireOptionalNativeModule } from "expo-modules-core";

export type DeviceLanguage = {
  code: string;
  // The language's own name ("Bahasa Melayu").
  name: string;
  // Its name in the device's language ("Malay").
  localName: string;
};

export type LanguageStatus = "ready" | "missing" | "unsupported";

export type SpeechStatus = "ready" | "no-engine" | "no-voices";

type NativeModule = {
  speak?(text: string, language: string): Promise<boolean>;
  stop?(): Promise<void>;
  getSpeechStatus(): Promise<SpeechStatus>;
  getInstalledLanguages(): Promise<DeviceLanguage[]>;
  getLanguageStatus(code: string): Promise<LanguageStatus>;
  getLanguageName(code: string): Promise<DeviceLanguage>;
  openVoiceSettings(): Promise<boolean>;
};

const native = requireOptionalNativeModule<NativeModule>("GibtalkVoices");

export async function getInstalledLanguages(): Promise<DeviceLanguage[]> {
  return native ? native.getInstalledLanguages() : [];
}

export async function getLanguageStatus(code: string): Promise<LanguageStatus> {
  return native ? native.getLanguageStatus(code) : "ready";
}

export async function getLanguageName(code: string): Promise<DeviceLanguage> {
  return native
    ? native.getLanguageName(code)
    : { code, name: code, localName: code };
}

// True if a settings screen was opened; false means show the steps instead.
export async function openVoiceSettings(): Promise<boolean> {
  return native ? native.openVoiceSettings() : false;
}

// Speaking through this module (Android): it reconnects to the engine when
// expo-speech would stay silent.
export const canSpeak = !!native?.speak;

export async function speak(text: string, language: string): Promise<boolean> {
  return native?.speak ? native.speak(text, language) : false;
}

export async function stop(): Promise<void> {
  await native?.stop?.();
}

export async function getSpeechStatus(): Promise<SpeechStatus> {
  return native ? native.getSpeechStatus() : "ready";
}
