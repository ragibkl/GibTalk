import { useRouter } from "expo-router";

import { CreateWord, useWordFormState, useWords } from "../src/service/words";

import WordDetailForm from "../src/components/WordDetailForm";

export default function CreateWordScreen() {
  const { addWord } = useWords();
  const router = useRouter();
  const form = useWordFormState();

  const onPressSave = () => {
    const word: CreateWord = {
      label: form.label.trim(),
      language: form.language,
      uri: form.uri,
    };

    if (form.isCategory) {
      word.children = [];
    }

    addWord(word);
    router.back();
  };

  return <WordDetailForm {...form} onPressSave={onPressSave} />;
}
