import { Action } from "../actions";
import { AppState } from "../appSchema";
import { isFetchingReducer } from "./isFetchingReducer";
import { wordHistoryReducer } from "./wordHistoryReducer";
import { wordPathReducer } from "./wordPathReducer";
import { wordsReducer } from "./wordsReducer";

export function appStateReducer(state: AppState, action: Action): AppState {
  let newState = wordsReducer(state, action);
  newState = wordPathReducer(newState, action);
  newState = isFetchingReducer(newState, action);
  newState = wordHistoryReducer(newState, action);
  return newState;
}
