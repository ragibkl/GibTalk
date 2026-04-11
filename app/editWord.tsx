import { useLocalSearchParams, useRouter } from "expo-router";

import WordDetailForm from "../src/components/WordDetailForm";
import { useAppState } from "../src/appState";
import {
  Word,
  findWordById,
  useWordFormState,
  useWords,
} from "../src/service/words";

function EditWordForm({ prevWord }: { prevWord: Word }) {
  const { updateWord } = useWords();
  const router = useRouter();
  const form = useWordFormState(prevWord);

  const onPressSave = () => {
    const word: Word = {
      id: prevWord.id,
      label: form.label.trim(),
      language: form.language,
      uri: form.uri,
    };

    if (form.isCategory) {
      word.children = prevWord.children || [];
    }

    updateWord(word);
    router.back();
  };

  return <WordDetailForm {...form} onPressSave={onPressSave} />;
}

export default function EditWordRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { appState } = useAppState();

  const prevWord = findWordById(appState.words, id);
  if (!prevWord) return null;

  return <EditWordForm key={prevWord.id} prevWord={prevWord} />;
}
