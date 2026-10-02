import * as Speech from "expo-speech";

import { Word } from "./words";

// A language code such as "en", "ms" or "ar". Which ones work depends on the
// voices installed on the device (see service/languages).
export type Language = string;

export const DEFAULT_LANG = "en";

// Older versions saved Telugu as "tu"; the standard code is "te".
export function normalizeLanguage(language: string): Language {
  return language === "tu" ? "te" : language;
}

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
