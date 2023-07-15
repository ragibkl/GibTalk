import * as Speech from 'expo-speech';

import { Word } from "../types";

const DEFAULT_LANG = 'en';

export function speakWord(word: Word) {
  Speech.speak(word.label, { language: word.language || DEFAULT_LANG });
}

export function stopSpeech() {
  Speech.stop();
}

export function speakInit() {
  Speech.speak('', { language: 'en' });
  Speech.speak('', { language: 'ms' });
  Speech.speak('', { language: 'zh' });
}
