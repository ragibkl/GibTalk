import { Word } from "../../service/words";

export type WordHistoryAction =
  | {
      type: "add-word-history";
      word: Word;
    }
  | {
      type: "clear-word-history";
    };
