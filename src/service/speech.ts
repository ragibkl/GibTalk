import * as Speech from "expo-speech";
import { Platform } from "react-native";

import * as Voices from "../../modules/gibtalk-voices";
import { Word } from "./words";

// A language code such as "en", "ms" or "ar". Which ones work depends on the
// voices installed on the device (see service/languages).
export type Language = string;

export const DEFAULT_LANG = "en";

// Older versions saved Telugu as "tu"; the standard code is "te".
export function normalizeLanguage(language: string): Language {
  return language === "tu" ? "te" : language;
}

// Android speaks through our own module, which reconnects to the engine if
// it was stopped while the app was open; expo-speech stayed silent until the
// app was restarted. iOS keeps expo-speech.
const useOwnSpeech = Platform.OS === "android" && Voices.canSpeak;

const resultListeners = new Set<(spoken: boolean) => void>();

// Called after each word: false when it couldn't be spoken even after
// reconnecting, true when it was.
export function onSpeechResult(
  listener: (spoken: boolean) => void,
): () => void {
  resultListeners.add(listener);
  return () => resultListeners.delete(listener);
}

// Resolves once the words are queued (not spoken).
async function say(text: string, language: Language) {
  if (!useOwnSpeech) {
    Speech.speak(text, { language });
    return;
  }
  const spoken = await Voices.speak(text, language).catch(() => false);
  resultListeners.forEach((listener) => listener(spoken));
}

export function speak(label: string, language: Language) {
  say(label, language);
}

export function speakWord(word: Word) {
  say(word.label, word.language);
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

  // One at a time, so mixed-language sentences keep their order.
  chunks.reduce(
    (queued, chunk) =>
      queued.then(() => say(chunk.labels.join(" "), chunk.language)),
    Promise.resolve(),
  );
}

export function stopSpeech() {
  if (useOwnSpeech) {
    Voices.stop().catch(() => {});
  } else {
    Speech.stop();
  }
}
