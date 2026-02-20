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

export function speakWords(words: Word[]) {
  type Chunk = {
    labels: string[];
    language: Language;
  };

  if (!words.length) {
    return;
  }

  let [firstWord, ...restWords] = words;
  const chunks: Chunk[] = [];
  let chunk: Chunk = {
    labels: [firstWord.label],
    language: firstWord.language,
  };

  for (let i = 0; i < restWords.length; i++) {
    const word = restWords[i];

    if (chunk.language !== word.language) {
      chunks.push(chunk);
      chunk = {
        labels: [word.label],
        language: word.language,
      };
    } else {
      chunk.labels.push(word.label);
    }
  }
  chunks.push(chunk);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const text = chunk.labels.join(" ");
    Speech.speak(text, { language: chunk.language });
  }
}

export function stopSpeech() {
  Speech.stop();
}
