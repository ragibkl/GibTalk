import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Word } from ".";
import { ProgressIcon } from "../../components/ProgressIcon";
import { WordAction, wordsReducer } from "./reducer";

export const IsFetchingContext = createContext<boolean>(false);
export const SetIsFetchingContext = createContext<
  (isFetching: boolean) => void
>((_isFetching) => {});
export const WordsContext = createContext<Word[]>([]);
export const WordsDispatchContext = createContext<React.Dispatch<WordAction>>(
  (_action) => {},
);

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

export function WordsProvider({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
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
            {isLoading ? <ProgressIcon /> : children}
          </WordsDispatchContext.Provider>
        </WordsContext.Provider>
      </SetIsFetchingContext.Provider>
    </IsFetchingContext.Provider>
  );
}

export function useWordsContext() {
  const isFetching = useContext(IsFetchingContext);
  const setIsFetching = useContext(SetIsFetchingContext);
  const words = useContext(WordsContext);
  const dispatch = useContext(WordsDispatchContext);

  return {
    isFetching,
    setIsFetching,
    words,
    dispatch,
  };
}
