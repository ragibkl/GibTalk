import { Action } from "../actions";
import { AppState } from "../schema";

export function wordClipboardReducer(
  wordsClipboard: AppState["wordClipboard"],
  action: Action,
  _prevState: AppState,
): AppState["wordClipboard"] {
  switch (action.type) {
    case "add-word-clipboard": {
      return [...wordsClipboard, action.word];
    }
    case "clear-word-clipboard": {
      return [];
    }
    default: {
      return wordsClipboard;
    }
  }
}
