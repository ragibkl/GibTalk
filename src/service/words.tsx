import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import uuid from "react-native-uuid";

import { base64Image } from "./image";
import { loadSampleWords } from "./sampleWords";
import { useWordPath } from "./wordPath";
import { Language } from "./speech";

export type Word = {
  id: string;
  label: string;
  uri: string;
  language: Language;
  children?: Word[];
};

export type CreateWord = Omit<Word, "id">;

async function storeWords(words: Word[]): Promise<void> {
  const jsonValue = JSON.stringify(words);
  await AsyncStorage.setItem("words-key", jsonValue);
}

async function readWords(): Promise<Word[] | null> {
  const jsonValue = await AsyncStorage.getItem("words-key");
  if (!jsonValue) {
    return null;
  }

  return JSON.parse(jsonValue) as Word[];
}

export const WordsContext = createContext([]);
export const WordsDispatchContext = createContext(null);

export function wordsReducer(words: Word[], action) {
  if (action.wordPath && action.wordPath.length) {
    const [p, ...wordPath] = action.wordPath;
    const i = words.findIndex((w) => w.id === p);

    const newWords = words.slice();
    newWords[i].children = wordsReducer(words[i].children, {
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
      throw Error("Unknown action: " + action.type);
    }
  }
}

export function WordsProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [words, dispatch] = useReducer(wordsReducer, []);

  const loadWords = async () => {
    const loadedWords = await readWords();

    if (loadedWords && loadedWords.length) {
      dispatch({ type: "set-words", words: loadedWords });
    } else {
      loadSampleWords().then((sampleWords) => {
        dispatch({ type: "set-words", words: sampleWords });
      });
    }

    setIsLoading(false);
  };

  useEffect(() => {
    loadWords();
  }, []);

  useEffect(() => {
    storeWords(words);
  }, [words]);

  return (
    <WordsContext.Provider value={words}>
      <WordsDispatchContext.Provider value={dispatch}>
        {!isLoading && children}
      </WordsDispatchContext.Provider>
    </WordsContext.Provider>
  );
}

export function useWords() {
  const { wordPath } = useWordPath();
  const words = useContext(WordsContext);
  const dispatch = useContext(WordsDispatchContext);

  const getWordsInPath = (wordIds: string[]): Word[] => {
    let result = words;
    for (let i = 0; i < wordIds.length; i++) {
      result = result.find((w) => w.id === wordIds[i]).children;
    }

    return result;
  };

  const wordsInPath = getWordsInPath(wordPath);

  const setWords = (words: Word[]) => {
    dispatch({ type: "set-words", words });
  };

  const addWord = async (createWordData: CreateWord) => {
    const word: Word = {
      ...createWordData,
      id: uuid.v4() as string,
      uri: await base64Image(createWordData.uri),
    };
    dispatch({ type: "add-word", word, wordPath });
  };

  const updateWord = async (updateWordData: Word) => {
    const word: Word = {
      ...updateWordData,
      uri: await base64Image(updateWordData.uri),
    };
    dispatch({ type: "update-word", word, wordPath });
  };

  const removeWord = (wordId: string) => {
    dispatch({ type: "remove-word", wordId, wordPath });
  };

  const moveWordLeft = (wordId: string) => {
    dispatch({ type: "move-word-left", wordId, wordPath });
  };

  const moveWordRight = (wordId: string) => {
    dispatch({ type: "move-word-right", wordId, wordPath });
  };

  return {
    words,
    wordsInPath,
    setWords,
    addWord,
    updateWord,
    removeWord,
    moveWordLeft,
    moveWordRight,
  };
}
