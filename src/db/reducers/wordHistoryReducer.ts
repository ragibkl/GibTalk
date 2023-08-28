import { Action } from "../actions";
import { AppState } from "../appSchema";

export function wordHistoryReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "add-word-history": {
      return {
        ...state,
        wordHistory: [...state.wordHistory, action.word],
      };
    }
    case "clear-word-history": {
      return {
        ...state,
        wordHistory: [],
      };
    }
    default: {
      return state;
    }
  }
}
