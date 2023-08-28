import { ReactNode, createContext, useReducer } from "react";
import { Word } from "./words";
import { useAppState } from "../db";

type WordPathAction =
  | {
      type: "add-path";
      wordId: string;
    }
  | {
      type: "pop";
    }
  | {
      type: "clear";
    };

function wordPathReducer(wordPath: string[], action: WordPathAction): string[] {
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
      throw Error("Unknown action");
    }
  }
}

export const WordPathContext = createContext<string[]>([]);
export const WordPathDispatchContext = createContext<
  React.Dispatch<WordPathAction>
>((_action) => {});

type Props = {
  children: ReactNode | ReactNode[];
};

export function WordPathProvider({ children }: Props) {
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
