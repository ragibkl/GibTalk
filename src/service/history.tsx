import { createContext, useContext, useReducer } from "react";
import { Word } from "./words";

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
  const history = useContext(HistoryContext);
  const dispatch = useContext(HistoryDispatchContext);

  const addWordToHistory = (word: Word) => {
    if (!history.length || history[history.length - 1].id !== word.id) {
      dispatch({ type: "add-word", word });
    }
  };

  const clearHistory = () => {
    dispatch({ type: "clear" });
  };

  return {
    history,
    addWordToHistory,
    clearHistory,
  };
}
