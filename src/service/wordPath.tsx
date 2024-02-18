import { Word } from "./words";
import { useAppState } from "../appState";

export function useWordPath() {
  const {
    appState: { wordPath },
    dispatch,
  } = useAppState();

  const addWordToPath = (word: Word) => {
    if (word.children) {
      dispatch({ type: "add-word-path", word });
    }
  };

  const pop = () => {
    dispatch({ type: "pop-word-path" });
  };

  const popToTop = () => {
    dispatch({ type: "clear-word-path" });
  };

  const popToWord = (word: Word) => {
    dispatch({ type: "pop-word-path-to-word", word });
  };

  return {
    wordPath,
    addWordToPath,
    pop,
    popToTop,
    popToWord,
  };
}
