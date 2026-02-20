import { useState } from "react";
import { useRouter } from "expo-router";

import { CreateWord, useWords } from "../../service/words";
import { DEFAULT_LANG, Language } from "../../service/speech";

import CommonWordDetailScreen from "./CommonWordDetailScreen";

export default function CreateWordScreen() {
  const { addWord } = useWords();
  const router = useRouter();

  const [label, setLabel] = useState("");
  const [language, setLanguage] = useState<Language>(DEFAULT_LANG);
  const [uri, setUri] = useState<string>("");
  const [isCategory, setIsCategory] = useState(false);

  const onPressSave = () => {
    const word: CreateWord = {
      label: label.trim(),
      language,
      uri,
    };

    if (isCategory) {
      word.children = [];
    }

    addWord(word);
    router.back();
  };

  return (
    <CommonWordDetailScreen
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
