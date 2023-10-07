import { Word } from "../../service/words";
import { Action } from "../actions";
import { AppState } from "../appSchema";

export function computeWordsState(
  words: Word[],
  action: Action,
  wordPath: string[],
): Word[] {
  if (wordPath && wordPath.length) {
    const [p, ...wp] = wordPath;
    const i = words.findIndex((w) => w.id === p);

    const newWords = words.slice();
    newWords[i].children = computeWordsState(
      words[i].children || [],
      action,
      wp,
    );

    return newWords;
  }

  switch (action.type) {
    case "set-words": {
      return action.words;
    }
    case "add-word": {
      return [...words, action.word];
    }
    case "update-word": {
      const i = words.findIndex((w) => w.id === action.word.id);
      const newWords = words.slice();
      newWords[i] = action.word;
      return newWords;
    }
    case "remove-word": {
      return words.filter((w) => w.id !== action.wordId);
    }
    case "move-word-left": {
      const i = words.findIndex((w) => w.id === action.wordId);
      if (i === 0 || i === -1) {
        return words;
      }

      const target = words[i];
      const left = words[i - 1];

      const newWords = words.slice();
      newWords[i - 1] = target;
      newWords[i] = left;
      return newWords;
    }
    case "move-word-right": {
      const i = words.findIndex((w) => w.id === action.wordId);
      if (i === words.length - 1) {
        return words;
      }

      const target = words[i];
      const right = words[i + 1];

      const newWords = words.slice();
      newWords[i + 1] = target;
      newWords[i] = right;

      return newWords;
    }
    default: {
      return words;
    }
  }
}

export function wordsReducer(
  words: AppState["words"],
  action: Action,
  prevState: AppState,
): AppState["words"] {
  return computeWordsState(words, action, prevState.wordPath);
}
