import uuid from "react-native-uuid";

import { DEFAULT_LANG, Language } from "./speech";
import { Word } from "./words";

type SampleWord = {
  label: string;
  uri: string;
  language?: Language;
  children?: SampleWord[];
};

const SAMPLE_WORDS: SampleWord[] = [
  {
    label: "Greetings",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/6522/",
    children: [
      {
        label: "Hello",
        uri: "https://www.senteacher.org/fullsymbol/arasaac/6522/",
      },
      {
        label: "Goodbye",
        uri: "https://www.senteacher.org/fullsymbol/arasaac/6028/",
      },
    ],
  },
  {
    label: "Yes",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/5584/",
  },
  {
    label: "No",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/5526/",
  },
  {
    label: "Up",
    uri: "https://www.senteacher.org/fullsymbol/mulberry/up.png/",
  },
  {
    label: "Down",
    uri: "https://www.senteacher.org/fullsymbol/mulberry/down.png/",
  },
  {
    label: "Good Job",
    uri: "https://www.senteacher.org/fullsymbol/mulberry/good.png/",
  },
  {
    label: "Makan",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/6456/",
    language: "ms",
  },
  {
    label: "Stop",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/8289/",
  },
  {
    label: "Go",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/21395/",
  },
  {
    label: "Wait",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/16697/",
  },
  {
    label: "Tunggu",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/16697/",
    language: "ms",
  },
  {
    label: "Run",
    uri: "https://www.senteacher.org/fullsymbol/mulberry/run_,_to.png/",
  },
  {
    label: "Walk",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/3251/",
  },
  {
    label: "Jump",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/28443/",
  },
  {
    label: "Turn around",
    uri: "https://www.senteacher.org/fullsymbol/mulberry/around.png/",
  },
  {
    label: "Go Up",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/6617/",
  },
  {
    label: "Panjat",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/28255/",
    language: "ms",
  },
  {
    label: "喝水",
    uri: "https://www.senteacher.org/fullsymbol/mulberry/drink_,_to.png/",
    language: "zh",
  },
  {
    label: "吃米饭",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/4609/",
    language: "zh",
  },
];

function sampleWordsToWords(sampleWords: SampleWord[]): Word[] {
  return sampleWords.map((word) => ({
    id: uuid.v4() as string,
    label: word.label,
    uri: word.uri,
    language: word.language || DEFAULT_LANG,
    children: word.children ? sampleWordsToWords(word.children) : undefined,
  }));
}

export function loadSampleWords(): Word[] {
  return sampleWordsToWords(SAMPLE_WORDS);
}
