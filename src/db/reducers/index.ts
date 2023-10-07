import { Action } from "../actions";
import { AppState } from "../appSchema";
import { isFetchingReducer } from "./isFetchingReducer";
import { wordHistoryReducer } from "./wordHistoryReducer";
import { wordPathReducer } from "./wordPathReducer";
import { wordsReducer } from "./wordsReducer";

export function appStateReducer(state: AppState, action: Action): AppState {
  return {
    isFetchingWords: isFetchingReducer(state.isFetchingWords, action, state),
    words: wordsReducer(state.words, action, state),
    wordHistory: wordHistoryReducer(state.wordHistory, action, state),
    wordPath: wordPathReducer(state.wordPath, action, state),
  };
}
