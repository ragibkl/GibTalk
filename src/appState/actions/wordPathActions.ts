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

type PopWordPathToWordAction = {
  type: "pop-word-path-to-word";
  word: Word;
};

export type WordPathAction =
  | ClearWordPathAction
  | AddWordPathAction
  | PopWordPathAction
  | PopWordPathToWordAction;
