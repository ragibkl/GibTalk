import { Word } from "./words";
import { useAppState } from "../db";

export function useHistory() {
  const {
    appState: { wordHistory },
    dispatch,
  } = useAppState();

  const addWordToHistory = (word: Word) => {
    if (
      !wordHistory.length ||
      wordHistory[wordHistory.length - 1].id !== word.id
    ) {
      dispatch({ type: "add-word-history", word });
    }
  };

  const clearHistory = () => {
    dispatch({ type: "clear-word-history" });
  };

  return {
    history: wordHistory,
    addWordToHistory,
    clearHistory,
  };
}
