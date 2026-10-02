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

type MoveWordAction = {
  type: "move-word";
  wordId: string;
  toIndex: number;
};

export type WordsAction =
  | SetWordsAction
  | AddWordAction
  | AddWordsAction
  | UpdateWordAction
  | RemoveWordAction
  | MoveWordAction;
