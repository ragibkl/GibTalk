import { Action } from "../actions";
import { AppState } from "../appSchema";

export function isFetchingReducer(
  isFetchingWords: AppState["isFetchingWords"],
  action: Action,
  _prevState: AppState,
): AppState["isFetchingWords"] {
  switch (action.type) {
    case "set-isfetching-words": {
      return action.value;
    }
    default: {
      return isFetchingWords;
    }
  }
}
