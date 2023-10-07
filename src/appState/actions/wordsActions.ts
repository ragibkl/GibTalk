import { Word } from "../../service/words";

type SetWordsAction = {
  type: "set-words";
  words: Word[];
};

type AddWordAction = {
  type: "add-word";
  word: Word;
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

export type WordAction =
  | SetWordsAction
  | AddWordAction
  | UpdateWordAction
  | RemoveWordAction
  | MoveWordLeft
  | MoveWordRight;
