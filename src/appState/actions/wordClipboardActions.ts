import { Word } from "../../service/words";

type AddWordClipboardAction = {
  type: "add-word-clipboard";
  word: Word;
};

type ClearWordClipboard = {
  type: "clear-word-clipboard";
};

export type WordClipboardAction = AddWordClipboardAction | ClearWordClipboard;
