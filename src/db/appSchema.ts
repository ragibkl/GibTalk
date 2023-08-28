import { Word } from "../service/words";

export type AppState = {
  isFetchingWords: boolean;
  words: Word[];
  wordHistory: Word[];
  wordPath: string[];
};

export const DEFAULT_APP_STATE: AppState = {
  isFetchingWords: false,
  words: [],
  wordHistory: [],
  wordPath: [],
};
