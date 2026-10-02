import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Alert, AppState, Platform } from "react-native";

import {
  DeviceLanguage,
  getInstalledLanguages,
  getLanguageName,
  openVoiceSettings,
} from "../../modules/gibtalk-voices";
import { Word } from "./words";

type LanguagesState = {
  // Languages the device has an offline voice for.
  installed: DeviceLanguage[];
  refresh(): Promise<void>;
};

const LanguagesContext = createContext<LanguagesState>({
  installed: [],
  refresh: async () => {},
});

export function LanguagesProvider(props: { children: ReactNode }) {
  const [installed, setInstalled] = useState<DeviceLanguage[]>([]);

  const refresh = useCallback(async () => {
    try {
      setInstalled(await getInstalledLanguages());
    } catch {
      setInstalled([]);
    }
  }, []);

  // Check again when coming back, e.g. after installing a voice.
  useEffect(() => {
    refresh();
    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh();
    });
    return () => sub.remove();
  }, [refresh]);

  return (
    <LanguagesContext.Provider value={{ installed, refresh }}>
      {props.children}
    </LanguagesContext.Provider>
  );
}

export function useDeviceLanguages() {
  return useContext(LanguagesContext);
}

export function wordLanguages(words: Word[]): string[] {
  const codes = new Set<string>();
  const walk = (list: Word[]) =>
    list.forEach((word) => {
      if (word.language) codes.add(word.language);
      if (word.children) walk(word.children);
    });
  walk(words);
  return [...codes];
}

// Languages these words use that the device has no voice for. Empty while
// the device's list is unknown, so a failed lookup never shows a warning.
export function missingLanguages(
  words: Word[],
  installed: DeviceLanguage[],
): string[] {
  if (!installed.length) return [];
  const codes = new Set(installed.map((l) => l.code));
  return wordLanguages(words).filter((code) => !codes.has(code));
}

export function useMissingLanguages(words: Word[]): string[] {
  const { installed } = useDeviceLanguages();
  return useMemo(() => missingLanguages(words, installed), [words, installed]);
}

export const FALLBACK_NAMES: Record<string, string> = {
  en: "English",
  ms: "Bahasa Melayu",
  id: "Bahasa Indonesia",
  zh: "中文",
  ta: "தமிழ்",
  te: "తెలుగు",
};

export async function languageName(code: string): Promise<string> {
  try {
    const { name } = await getLanguageName(code);
    if (name && name !== code) return name;
  } catch {}
  return FALLBACK_NAMES[code] ?? code;
}

export function useLanguageNames(codes: string[]): string[] {
  const [names, setNames] = useState<string[]>(codes);
  const key = codes.join(",");
  useEffect(() => {
    let live = true;
    Promise.all(codes.map(languageName)).then((n) => live && setNames(n));
    return () => {
      live = false;
    };
  }, [key]);
  return names;
}

function showVoiceSteps() {
  Alert.alert(
    "Add a voice",
    Platform.OS === "ios"
      ? "Open Settings → Accessibility → Spoken Content → Voices, choose the language and download a voice. Then come back to GibTalk."
      : 'Open Settings, search for "Text-to-speech output", open the settings of the preferred engine and install the voice data for the language. Then come back to GibTalk.',
  );
}

// Opens the voice download screen, or explains where to find it.
export async function openAddVoice() {
  const opened = await openVoiceSettings().catch(() => false);
  if (!opened) showVoiceSteps();
}

export async function promptMissingVoices(codes: string[]) {
  if (!codes.length) return;
  const names = (await Promise.all(codes.map(languageName))).join(", ");
  Alert.alert(
    "Install a voice",
    `Some words use ${names}, but this device has no voice for ${
      codes.length > 1 ? "them" : "it"
    } yet. Until you install one, those words are read in another language.`,
    [
      { text: "Not now", style: "cancel" },
      { text: "Install voice", onPress: () => openAddVoice() },
    ],
  );
}
