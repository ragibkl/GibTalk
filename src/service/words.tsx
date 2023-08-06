import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { ActivityIndicator } from "react-native";
import uuid from "react-native-uuid";

import { base64Image } from "./image";
import { useWordPath } from "./wordPath";
import { Language } from "./speech";

export type Word = {
  id: string;
  label: string;
  uri: string;
  language: Language;
  children?: Word[];
};

export type CreateWord = {
  label: string;
  uri: string;
  language: Language;
  children?: [];
};

async function storeWords(words: Word[]): Promise<void> {
  const jsonValue = JSON.stringify(words || []);
  await AsyncStorage.setItem("words-key", jsonValue);
}

async function readWords(): Promise<Word[] | null> {
  const jsonValue = await AsyncStorage.getItem("words-key");
  if (!jsonValue) {
    return null;
  }

  return JSON.parse(jsonValue) as Word[];
}

export const IsFetchingContext = createContext<boolean>(false);
export const SetIsFetchingContext = createContext(null);
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

export async function wordImagesBase64(words: Word[]): Promise<Word[]> {
  return Promise.all(
    words.map(async (word) => ({
      ...word,
      uri: await base64Image(word.uri),
      children: word.children
        ? await wordImagesBase64(word.children)
        : undefined,
    })),
  );
}

export function WordsProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [words, dispatch] = useReducer(wordsReducer, []);

  const loadWords = async () => {
    const loadedWords = await readWords();

    if (loadedWords && loadedWords.length) {
      dispatch({ type: "set-words", words: loadedWords });
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
    <IsFetchingContext.Provider value={isFetching}>
      <SetIsFetchingContext.Provider value={setIsFetching}>
        <WordsContext.Provider value={words}>
          <WordsDispatchContext.Provider value={dispatch}>
            {isLoading ? <ActivityIndicator /> : children}
          </WordsDispatchContext.Provider>
        </WordsContext.Provider>
      </SetIsFetchingContext.Provider>
    </IsFetchingContext.Provider>
  );
}

export function useWords() {
  const isFetching = useContext(IsFetchingContext);
  const setIsFetching = useContext(SetIsFetchingContext);
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

  const setWords = async (words: Word[]) => {
    setIsFetching(true);
    const normalizedWords = await wordImagesBase64(words);
    setIsFetching(false);
    dispatch({ type: "set-words", words: normalizedWords });
  };

  const addWord = async (createWordData: CreateWord) => {
    const word: Word = {
      ...createWordData,
      id: uuid.v4() as string,
    };
    dispatch({ type: "add-word", word, wordPath });

    const updatedWord: Word = {
      ...word,
      uri: await base64Image(word.uri),
    };
    dispatch({ type: "update-word", word: updatedWord, wordPath });
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
    isFetching,
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
