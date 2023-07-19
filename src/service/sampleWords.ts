import uuid from "react-native-uuid";

import { Language, Word } from "../types";
import { base64Image } from "./image";

type SampleWord = {
  label: string;
  uri: string;
  language?: Language;
};

export const SAMPLE_WORDS: SampleWord[] = [
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

export async function loadSampleWords(): Promise<Word[]> {
  return Promise.all(
    SAMPLE_WORDS.map(async (word) => ({
      ...word,
      language: word.language || "en",
      id: uuid.v4() as string,
      uri: await base64Image(word.uri),
    })),
  );
}
