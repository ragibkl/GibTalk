import { Word } from "../service/words";

export type AppState = {
  isFetchingWords: boolean;
  words: Word[];
  wordClipboard: Word[];
  wordHistory: Word[];
  wordPath: Word[];
};

export const DEFAULT_APP_STATE: AppState = {
  isFetchingWords: false,
  words: [],
  wordClipboard: [],
  wordHistory: [],
  wordPath: [],
};
