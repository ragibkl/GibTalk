import { Word } from "../../service/words";

type SetWordsAction = {
  type: "set-words";
  words: Word[];
};

type AddWordAction = {
  type: "add-word";
  word: Word;
};

type AddWordsAction = {
  type: "add-words";
  words: Word[];
};

type UpdateWordAction = {
  type: "update-word";
  word: Word;
};

type RemoveWordAction = {
  type: "remove-word";
  wordId: string;
};

type MoveWordLeft = {
  type: "move-word-left";
  wordId: string;
};

type MoveWordRight = {
  type: "move-word-right";
  wordId: string;
};

export type WordsAction =
  | SetWordsAction
  | AddWordAction
  | AddWordsAction
  | UpdateWordAction
  | RemoveWordAction
  | MoveWordLeft
  | MoveWordRight;
