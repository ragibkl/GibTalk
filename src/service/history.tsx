import { createContext, useReducer } from "react";
import { Word } from "./words";
import { useAppState } from "../db";

type HistoryAction =
  | {
      type: "add-word";
      word: Word;
    }
  | {
      type: "clear";
    };

function historyReducer(history: Word[], action: HistoryAction): Word[] {
  switch (action.type) {
    case "add-word": {
      return [...history, action.word];
    }
    case "clear": {
      return [];
    }
    default: {
      throw Error("Unknown action");
    }
  }
}

export const HistoryContext = createContext<Word[]>([]);
export const HistoryDispatchContext = createContext<
  React.Dispatch<HistoryAction>
>(() => {});

export function HistoryProvider({ children }: React.PropsWithChildren) {
  const [history, dispatch] = useReducer(historyReducer, []);

  return (
    <HistoryContext.Provider value={history}>
      <HistoryDispatchContext.Provider value={dispatch}>
        {children}
      </HistoryDispatchContext.Provider>
    </HistoryContext.Provider>
  );
}

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
