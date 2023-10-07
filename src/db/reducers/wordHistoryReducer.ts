import { Action } from "../actions";
import { AppState } from "../appSchema";

export function wordHistoryReducer(
  wordHistory: AppState["wordHistory"],
  action: Action,
  _prevState: AppState,
): AppState["wordHistory"] {
  switch (action.type) {
    case "add-word-history": {
      return [...wordHistory, action.word];
    }
    case "clear-word-history": {
      return [];
    }
    default: {
      return wordHistory;
    }
  }
}
