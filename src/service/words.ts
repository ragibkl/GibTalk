import uuid from "react-native-uuid";

import { base64Image } from "./image";
import { Language } from "./speech";
import { useAppState } from "../db";

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

function getWordsInPath(words: Word[], wordIds: string[]): Word[] {
  let result = words;
  for (let i = 0; i < wordIds.length; i++) {
    const parentWord = result.find((w) => w.id === wordIds[i]);
    if (!parentWord) {
      return [];
    }

    result = parentWord.children || [];
  }

  return result;
};

export function useWords() {
  const { appState: {
    words,
    isFetchingWords: isFetching,
    wordPath
  }, dispatch } = useAppState();

  const setIsFetching = (value: boolean) => {
    dispatch({
      type: "set-isfetching-words",
      value,
    });
  };

  const wordsInPath = getWordsInPath(words, wordPath);

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
    dispatch({ type: "add-word", word });

    const updatedWord: Word = {
      ...word,
      uri: await base64Image(word.uri),
    };
    dispatch({ type: "update-word", word: updatedWord });
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
