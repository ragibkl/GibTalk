import { Word } from "../../service/words";

type ClearWordPathAction = {
  type: "clear-word-path";
};

type AddWordPathAction = {
  type: "add-word-path";
  word: Word;
};

type PopWordPathAction = {
  type: "pop-word-path";
};

export type WordPathAction =
  | ClearWordPathAction
  | AddWordPathAction
  | PopWordPathAction;
