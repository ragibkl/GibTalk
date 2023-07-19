import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import uuid from "react-native-uuid";

import { Word } from "../types";
import { base64Image } from "./image";

type CreateWord = Omit<Word, "id">;

export const SAMPLE_WORDS: CreateWord[] = [
  {
    label: "Yes",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/5584/",
  },
  {
    label: "No",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/5526/",
  },
  {
    label: "Up",
    uri: "https://www.senteacher.org/fullsymbol/mulberry/up.png/",
  },
  {
    label: "Down",
    uri: "https://www.senteacher.org/fullsymbol/mulberry/down.png/",
  },
  {
    label: "Good Job",
    uri: "https://www.senteacher.org/fullsymbol/mulberry/good.png/",
  },
  {
    label: "Makan",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/6456/",
    language: "ms",
  },
  {
    label: "Stop",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/8289/",
  },
  {
    label: "Go",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/21395/",
  },
  {
    label: "Wait",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/16697/",
  },
  {
    label: "Tunggu",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/16697/",
    language: "ms",
  },
  {
    label: "Run",
    uri: "https://www.senteacher.org/fullsymbol/mulberry/run_,_to.png/",
  },
  {
    label: "Walk",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/3251/",
  },
  {
    label: "Jump",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/28443/",
  },
  {
    label: "Turn around",
    uri: "https://www.senteacher.org/fullsymbol/mulberry/around.png/",
  },
  {
    label: "Go Up",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/6617/",
  },
  {
    label: "Panjat",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/28255/",
    language: "ms",
  },
  {
    label: "喝水",
    uri: "https://www.senteacher.org/fullsymbol/mulberry/drink_,_to.png/",
    language: "zh",
  },
  {
    label: "吃米饭",
    uri: "https://www.senteacher.org/fullsymbol/arasaac/4609/",
    language: "zh",
  },
];

async function loadSampleWords(): Promise<Word[]> {
  return Promise.all(
    SAMPLE_WORDS.map(async (word) => ({
      ...word,
      id: uuid.v4() as string,
      uri: await base64Image(word.uri),
    })),
  );
}

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
  switch (action.type) {
    case "set-words": {
      return action.words;
    }
    case "add-word": {
      return [...words, action.word];
    }
    case "update-word": {
      let i = words.findIndex((w) => w.id === action.word.id);
      let left = words.slice(0, i);
      let right = words.slice(i + 1);
      return [...left, action.word, ...right];
    }
    case "remove-word": {
      return words.filter((w) => w.id !== action.wordId);
    }
    case "move-word-left": {
      let i = words.findIndex((w) => w.id === action.wordId);
      if (i === 0) {
        return;
      }

      let start = words.slice(0, i - 1);
      let left = words[i - 1];
      let end = words.slice(i + 1);
      return [...start, words[i], left, ...end];
    }
    case "move-word-right": {
      let i = words.findIndex((w) => w.id === action.wordId);
      if (i === words.length - 1) {
        return;
      }

      let start = words.slice(0, i);
      let right = words[i + 1];
      let end = words.slice(i + 2);

      return [...start, right, words[i], ...end];
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
  const words = useContext(WordsContext);
  const dispatch = useContext(WordsDispatchContext);

  const setWords = (words: Word[]) => {
    dispatch({ type: "set-words", words });
  };

  const addWord = async (createWordData: CreateWord) => {
    const word: Word = {
      ...createWordData,
      id: uuid.v4() as string,
      uri: await base64Image(createWordData.uri),
    };
    dispatch({ type: "add-word", word });
  };

  const updateWord = async (updateWordData: Word) => {
    const word: Word = {
      ...updateWordData,
      uri: await base64Image(updateWordData.uri),
    };
    dispatch({ type: "update-word", word });
  };

  const removeWord = (wordId: string) => {
    dispatch({ type: "remove-word", wordId });
  };

  const moveWordLeft = (wordId: string) => {
    dispatch({ type: "move-word-left", wordId });
  };

  const moveWordRight = (wordId: string) => {
    dispatch({ type: "move-word-right", wordId });
  };

  return {
    words,
    setWords,
    addWord,
    updateWord,
    removeWord,
    moveWordLeft,
    moveWordRight,
  };
}
