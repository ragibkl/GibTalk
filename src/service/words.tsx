import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import uuid from 'react-native-uuid';

import { Word } from '../types';
type CreateWord = Omit<Word, 'id'>;

export const SAMPLE_WORDS: Word[] = [
  { id: '1', label: 'Yes', uri: 'https://www.senteacher.org/fullsymbol/arasaac/5584/' },
  { id: '2', label: 'No', uri: 'https://www.senteacher.org/fullsymbol/arasaac/5526/' },
  { id: '3', label: 'Up', uri: 'https://www.senteacher.org/fullsymbol/mulberry/up.png/' },
  { id: '4', label: 'Down', uri: 'https://www.senteacher.org/fullsymbol/mulberry/down.png/' },
  { id: '5', label: 'Good Job', uri: 'https://www.senteacher.org/fullsymbol/mulberry/good.png/' },
  { id: '6', label: 'Makan', uri: 'https://www.senteacher.org/fullsymbol/arasaac/6456/', language: 'ms' },
  { id: '7', label: 'Stop', uri: 'https://www.senteacher.org/fullsymbol/arasaac/8289/' },
  { id: '8', label: 'Go', uri: 'https://www.senteacher.org/fullsymbol/arasaac/21395/' },
  { id: '9', label: 'Wait', uri: 'https://www.senteacher.org/fullsymbol/arasaac/16697/' },
  { id: '10', label: 'Tunggu', uri: 'https://www.senteacher.org/fullsymbol/arasaac/16697/', language: 'ms' },
  { id: '11', label: 'Run', uri: 'https://www.senteacher.org/fullsymbol/mulberry/run_,_to.png/' },
  { id: '12', label: 'Walk', uri: 'https://www.senteacher.org/fullsymbol/arasaac/3251/' },
  { id: '13', label: 'Jump', uri: 'https://www.senteacher.org/fullsymbol/arasaac/28443/' },
  { id: '14', label: 'Turn around', uri: 'https://www.senteacher.org/fullsymbol/mulberry/around.png/' },
  { id: '15', label: 'Go Up', uri: 'https://www.senteacher.org/fullsymbol/arasaac/6617/' },
  { id: '16', label: 'Panjat', uri: 'https://www.senteacher.org/fullsymbol/arasaac/28255/', language: 'ms' },
  { id: '17', label: '喝水', uri: 'https://www.senteacher.org/fullsymbol/mulberry/drink_,_to.png/', language: 'zh' },
  { id: '18', label: '吃米饭', uri: 'https://www.senteacher.org/fullsymbol/arasaac/4609/', language: 'zh' }
];

async function storeWords(words: Word[]): Promise<void> {
  const jsonValue = JSON.stringify(words);
  await AsyncStorage.setItem('words-key', jsonValue);
}

async function readWords(): Promise<Word[] | null> {
  const jsonValue = await AsyncStorage.getItem('words-key');
  if (!jsonValue) {
    return null
  }

  return JSON.parse(jsonValue) as Word[];
}

export const WordsContext = createContext([]);
export const WordsDispatchContext = createContext(null);

export function wordsReducer(words: Word[], action) {
  switch (action.type) {
    case 'set-words': {
      return action.words;
    }
    case 'add-word': {
      return [...words, action.word];
    }
    case 'update-word': {
      let i = words.findIndex(w => w.id === action.word.id)
      let left = words.slice(0, i);
      let right = words.slice(i + 1);
      return [...left, action.word, ...right];
    }
    case 'remove-word': {
      return words.filter(w => w.id !== action.wordId);
    }
    case 'move-word-left': {
      let i = words.findIndex(w => w.id === action.wordId)
      if (i === 0) {
        return;
      }

      let start = words.slice(0, i - 1);
      let left = words[i - 1];
      let end = words.slice(i + 1);
      return [...start, words[i], left, ...end];
    }
    case 'move-word-right': {
      let i = words.findIndex(w => w.id === action.wordId)
      if (i === words.length - 1) {
        return;
      }

      let start = words.slice(0, i);
      let right = words[i + 1];
      let end = words.slice(i + 2);

      return [...start, right, words[i], ...end]
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

export function WordsProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [words, dispatch] = useReducer(wordsReducer, []);

  const loadWords = async () => {
    const loadedWords = await readWords();

    if (loadedWords && loadedWords.length) {
      dispatch({ type: 'set-words', words: loadedWords });
    } else {
      dispatch({ type: 'set-words', words: SAMPLE_WORDS });
    }

    setIsLoading(false)
  }

  useEffect(() => {
    loadWords();
  }, [])

  useEffect(() => {
    storeWords(words);
  }, [words])

  return (
    <WordsContext.Provider value={words}>
      <WordsDispatchContext.Provider value={dispatch}>
        {!isLoading && children}
      </WordsDispatchContext.Provider>
    </WordsContext.Provider>
  );
}

export function useWords() {
  const words = useContext(WordsContext)
  const dispatch = useContext(WordsDispatchContext)

  const addWord = (createWordData: CreateWord) => {
    const word = {
      id: uuid.v4(),
      ...createWordData
    };
    dispatch({ type: 'add-word', word })
  }

  const updateWord = (word: Word) => {
    dispatch({ type: 'update-word', word })
  }

  const removeWord = (wordId: string) => {
    dispatch({ type: 'remove-word', wordId })
  }

  const moveWordLeft = (wordId: string) => {
    dispatch({ type: 'move-word-left', wordId })
  }

  const moveWordRight = (wordId: string) => {
    dispatch({ type: 'move-word-right', wordId })
  }

  return { words, addWord, updateWord, removeWord, moveWordLeft, moveWordRight }
}
