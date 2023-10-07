import { IsFetchingAction } from "./isFetchingActions";
import { WordHistoryAction } from "./wordHistoryActions";
import { WordPathAction } from "./wordPathActions";
import { WordAction } from "./wordsActions";

export type Action =
  | IsFetchingAction
  | WordAction
  | WordPathAction
  | WordHistoryAction;
