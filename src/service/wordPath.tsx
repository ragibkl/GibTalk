import { createContext, useContext, useReducer } from "react";
import { Word } from "../types";

export const WordPathContext = createContext<string[]>([]);
export const WordPathDispatchContext = createContext(null);

function wordPathReducer(wordPath: string[], action): string[] {
  switch (action.type) {
    case "add-path": {
      return [...wordPath, action.wordId];
    }
    case "pop": {
      return wordPath.slice(0, wordPath.length - 1);
    }
    case "clear": {
      return [];
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

export function WordPathProvider({ children }) {
  const [wordPath, dispatch] = useReducer(wordPathReducer, []);

  return (
    <WordPathContext.Provider value={wordPath}>
      <WordPathDispatchContext.Provider value={dispatch}>
        {children}
      </WordPathDispatchContext.Provider>
    </WordPathContext.Provider>
  );
}

export function useWordPath() {
  const wordPath = useContext(WordPathContext);
  const dispatch = useContext(WordPathDispatchContext);

  const addWordToPath = (word: Word) => {
    if (word.children) {
      dispatch({ type: "add-path", wordId: word.id });
    }
  };

  const pop = () => {
    dispatch({ type: "pop" });
  };

  const popToTop = () => {
    dispatch({ type: "clear" });
  };

  return {
    wordPath,
    addWordToPath,
    pop,
    popToTop,
  };
}
