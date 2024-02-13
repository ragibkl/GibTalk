import uuid from "react-native-uuid";

import { Word } from "./words";
import { useAppState } from "../appState";

function cloneWords(words: Word[]): Word[] {
  return words.map((word) => ({
    ...word,
    id: uuid.v4().toString(),
    children: word.children ? cloneWords(word.children) : undefined,
  }));
}

export function useClipboard() {
  const {
    appState: { wordClipboard: clipboard },
    dispatch,
  } = useAppState();

  const copyWord = (word: Word) => {
    if (!clipboard.length || clipboard[clipboard.length - 1].id !== word.id) {
      dispatch({ type: "add-word-clipboard", word });
    }
  };

  const pasteWords = () => {
    const words = cloneWords(clipboard);
    dispatch({ type: "add-words", words });
  };

  const clearClipboard = () => {
    dispatch({ type: "clear-word-clipboard" });
  };

  return {
    clipboard,
    copyWord,
    pasteWords,
    clearClipboard,
  };
}
