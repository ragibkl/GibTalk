import { Word } from "./words";
import { useAppState } from "../appState";

export function useWordPath() {
  const {
    appState: { wordPath },
    dispatch,
  } = useAppState();

  const addWordToPath = (word: Word) => {
    if (word.children) {
      dispatch({ type: "add-word-path", wordId: word.id });
    }
  };

  const pop = () => {
    dispatch({ type: "pop-word-path" });
  };

  const popToTop = () => {
    dispatch({ type: "clear-word-path" });
  };

  return {
    wordPath,
    addWordToPath,
    pop,
    popToTop,
  };
}
