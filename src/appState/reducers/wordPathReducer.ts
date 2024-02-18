import { Action } from "../actions";
import { AppState } from "../schema";

export function wordPathReducer(
  wordPath: AppState["wordPath"],
  action: Action,
  _prevState: AppState,
): AppState["wordPath"] {
  switch (action.type) {
    case "add-word-path": {
      return [...wordPath, action.word];
    }
    case "pop-word-path": {
      return wordPath.slice(0, wordPath.length - 1);
    }
    case "clear-word-path": {
      return [];
    }
    default: {
      return wordPath;
    }
  }
}
