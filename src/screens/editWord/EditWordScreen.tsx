import { useState } from "react";
import { useRouter } from "expo-router";

import { Language } from "../../service/speech";
import { useWords, Word } from "../../service/words";

import CommonWordDetailScreen from "./CommonWordDetailScreen";

type Props = { word: Word };

export default function EditWordScreen({ word: prevWord }: Props) {
  const { updateWord } = useWords();
  const router = useRouter();

  const [label, setLabel] = useState(prevWord.label);
  const [language, setLanguage] = useState<Language>(prevWord.language);
  const [uri, setUri] = useState(prevWord.uri);
  const [isCategory, setIsCategory] = useState(!!prevWord.children);

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
