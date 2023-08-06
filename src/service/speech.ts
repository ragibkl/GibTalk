import * as Speech from "expo-speech";

import { Word } from "./words";

export type Language = "en" | "ms" | "id" | "zh" | "ta" | "tu";
export type LanguageOption = {
  label: string;
  language: Language;
};

export const DEFAULT_LANG = "en";

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { label: "English", language: "en" },
  { label: "Bahasa Malaysia", language: "ms" },
  { label: "Bahasa Indonesia", language: "id" },
  { label: "Chinese", language: "zh" },
  { label: "Tamil", language: "ta" },
  { label: "Telugu", language: "tu" },
];

export function speak(label: string, language: Language) {
  Speech.speak(label, { language });
}

export function speakWord(word: Word) {
  Speech.speak(word.label, { language: word.language });
}

export function stopSpeech() {
  Speech.stop();
}

export function speakInit() {
  Speech.speak("", { language: "en" });
  Speech.speak("", { language: "ms" });
  Speech.speak("", { language: "zh" });
}
