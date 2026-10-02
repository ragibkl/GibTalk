import { requireOptionalNativeModule } from "expo-modules-core";

export type DeviceLanguage = {
  code: string;
  // The language's own name ("Bahasa Melayu").
  name: string;
  // Its name in the device's language ("Malay").
  localName: string;
};

export type LanguageStatus = "ready" | "missing" | "unsupported";

type NativeModule = {
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
