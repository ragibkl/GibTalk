import { Action } from "../actions";
import { AppState } from "../appSchema";

export function wordPathReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "add-word-path": {
      return {
        ...state,
        wordPath: [...state.wordPath, action.wordId],
      };
    }
    case "pop-word-path": {
      return {
        ...state,
        wordPath: state.wordPath.slice(0, state.wordPath.length - 1),
      };
    }
    case "clear-word-path": {
      return {
        ...state,
        wordPath: [],
      };
    }
    default: {
      return state;
    }
  }
}
