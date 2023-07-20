import { createContext, useContext, useReducer } from "react";
import { Word } from "./words";

export const HistoryContext = createContext<Word[]>([]);
export const HistoryDispatchContext = createContext(null);

function historyReducer(history: Word[], action): Word[] {
  switch (action.type) {
    case "add-word": {
      return [...history, action.word];
    }
    case "clear": {
      return [];
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

export function HistoryProvider({ children }) {
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
