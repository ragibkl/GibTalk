import { Word } from "../../service/words";

type AddWordHistoryAction = {
  type: "add-word-history";
  word: Word;
};

type ClearWordHistoryAction = {
  type: "clear-word-history";
};
export type WordHistoryAction = AddWordHistoryAction | ClearWordHistoryAction;
