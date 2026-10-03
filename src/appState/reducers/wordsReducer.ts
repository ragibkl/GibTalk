import { Word } from "../../service/words";
import { Action } from "../actions";
import { AppState } from "../schema";

export function computeWordsState(
  words: Word[],
  action: Action,
  wordPathIds: string[],
): Word[] {
  // Restore and templates replace the whole list, wherever the user is.
  if (action.type === "set-words") {
    return action.words;
  }

  if (wordPathIds && wordPathIds.length) {
    const [p, ...wp] = wordPathIds;
    const i = words.findIndex((w) => w.id === p);
    if (i === -1) {
      return words;
    }

    const newWords = words.slice();
    newWords[i] = {
      ...words[i],
      children: computeWordsState(words[i].children || [], action, wp),
    };

    return newWords;
  }

  switch (action.type) {
    case "add-word": {
      return [...words, action.word];
    }
    case "add-words": {
      return [...words, ...action.words];
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
    case "move-word": {
      const i = words.findIndex((w) => w.id === action.wordId);
      if (i === -1) {
        return words;
      }

      const newWords = words.slice();
      const [word] = newWords.splice(i, 1);
      newWords.splice(action.toIndex, 0, word);
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
  const wordPathIds = prevState.wordPath.map((w) => w.id);
  return computeWordsState(words, action, wordPathIds);
}
