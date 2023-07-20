import * as Speech from "expo-speech";

import { Word } from "./words";

export const DEFAULT_LANG = "en";
export type Language = "en" | "ms" | "zh";

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
