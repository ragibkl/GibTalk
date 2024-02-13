import { IsFetchingAction } from "./isFetchingActions";
import { WordHistoryAction } from "./wordHistoryActions";
import { WordPathAction } from "./wordPathActions";
import { WordsAction } from "./wordsActions";
import { WordClipboardAction } from "./wordClipboardActions";

export type Action =
  | IsFetchingAction
  | WordsAction
  | WordHistoryAction
  | WordPathAction
  | WordClipboardAction;
