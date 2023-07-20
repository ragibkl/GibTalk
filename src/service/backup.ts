import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import uuid from "react-native-uuid";
import YAML from "yaml";

import { Word, useWords } from "./words";
import { Language } from "./speech";

type WordBak = {
  label: string;
  uri: string;
  language: Language;
  children?: WordBak[];
};

function wordsToWordsBak(words: Word[]): WordBak[] {
  return words.map((word) => ({
    label: word.label,
    uri: word.uri,
    language: word.language,
    children: word.children ? wordsToWordsBak(word.children) : undefined,
  }));
}

function wordsBakToWords(wordsBak: WordBak[]): Word[] {
  return wordsBak.map((wordBak) => ({
    id: uuid.v4().toString(),
    label: wordBak.label,
    uri: wordBak.uri,
    language: wordBak.language,
    children: wordBak.children ? wordsBakToWords(wordBak.children) : undefined,
  }));
}

export function useBackup() {
  const { words, setWords } = useWords();

  const createBackup = async () => {
    const fileUri = `${FileSystem.documentDirectory}/gibtalk-bak.yaml`;
    const contents = YAML.stringify(wordsToWordsBak(words));
    await FileSystem.writeAsStringAsync(fileUri, contents);

    Sharing.shareAsync(fileUri);
  };

  const restoreBackup = async () => {
    const pickerResult = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
    });

    if (pickerResult.type !== "success") {
      return;
    }

    const fileUri = `${FileSystem.cacheDirectory}/${pickerResult.name}`;
    await FileSystem.copyAsync({
      from: pickerResult.uri,
      to: fileUri,
    });

    const contents = await FileSystem.readAsStringAsync(fileUri);
    const wordsBak = YAML.parse(contents) as WordBak[];
    await setWords(wordsBakToWords(wordsBak));
  };

  return { createBackup, restoreBackup };
}
