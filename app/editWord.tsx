import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import WordDetailForm from "../src/components/WordDetailForm";
import { useAppState } from "../src/appState";
import { DEFAULT_LANG, Language } from "../src/service/speech";
import { Word, useWords } from "../src/service/words";

function findWordById(words: Word[], id: string): Word | undefined {
  for (const word of words) {
    if (word.id === id) return word;
    if (word.children) {
      const found = findWordById(word.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

export default function EditWordRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appState } = useAppState();
  const { updateWord } = useWords();
  const router = useRouter();

  const prevWord = findWordById(appState.words, id);

  const [label, setLabel] = useState(prevWord?.label ?? "");
  const [language, setLanguage] = useState<Language>(
    prevWord?.language ?? DEFAULT_LANG,
  );
  const [uri, setUri] = useState(prevWord?.uri ?? "");
  const [isCategory, setIsCategory] = useState(!!prevWord?.children);

  if (!prevWord) return null;

  const onPressSave = () => {
    const word: Word = {
      id: prevWord.id,
      label: label.trim(),
      language,
      uri,
    };

    if (isCategory) {
      word.children = prevWord.children || [];
    }

    updateWord(word);
    router.back();
  };

  return (
    <WordDetailForm
      label={label}
      language={language}
      isCategory={isCategory}
      uri={uri}
      onUpdateLabel={setLabel}
      onUpdateLanguage={setLanguage}
      onUpdateIsCategory={setIsCategory}
      onUpdateUri={setUri}
      onPressSave={onPressSave}
    />
  );
}
