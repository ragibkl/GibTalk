import { useLocalSearchParams } from "expo-router";

import { useAppState } from "../src/appState";
import EditWordScreen from "../src/screens/editWord/EditWordScreen";
import { Word } from "../src/service/words";

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

  const word = findWordById(appState.words, id);
  if (!word) return null;

  return <EditWordScreen word={word} />;
}
