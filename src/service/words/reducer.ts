import { Word } from ".";

type SetWordsAction = {
  type: "set-words";
  words: Word[];
};

type AddWordAction = {
  type: "add-word";
  word: Word;
};

type UpdateWordAction = {
  type: "update-word";
  word: Word;
};

type RemoveWordAction = {
  type: "remove-word";
  wordId: string;
};

type MoveWordLeft = {
  type: "move-word-left";
  wordId: string;
};

type MoveWordRight = {
  type: "move-word-right";
  wordId: string;
};

export type WordAction = (
  | SetWordsAction
  | AddWordAction
  | UpdateWordAction
  | RemoveWordAction
  | MoveWordLeft
  | MoveWordRight
) & {
  wordPath?: string[];
};

export function wordsReducer(words: Word[], action: WordAction) {
  if (action.wordPath && action.wordPath.length) {
    const [p, ...wordPath] = action.wordPath;
    const i = words.findIndex((w) => w.id === p);

    const newWords = words.slice();
    newWords[i].children = wordsReducer(words[i].children || [], {
      ...action,
      wordPath,
    });

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
      throw Error("Unknown action");
    }
  }
}
