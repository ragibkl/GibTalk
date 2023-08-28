import { Action } from "../actions";
import { AppState } from "../appSchema";

export function isFetchingReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "set-isfetching-words": {
      return {
        ...state,
        isFetchingWords: action.value,
      };
    }
    default: {
      return state;
    }
  }
}
