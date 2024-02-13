import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
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
    const contents = YAML.stringify(wordsToWordsBak(words));

    if (Platform.OS === "ios") {
      const fileUri = `${FileSystem.documentDirectory}/gibtalk-bak.yaml`;
      await FileSystem.writeAsStringAsync(fileUri, contents);

      Sharing.shareAsync(fileUri, { UTI: "public.item" });
    } else if (Platform.OS === "android") {
      const fileUri = `${FileSystem.documentDirectory}/gibtalk-bak.yaml`;
      await FileSystem.writeAsStringAsync(fileUri, contents);

      Sharing.shareAsync(fileUri);
    }
  };

  const restoreBackup = async () => {
    const pickerResult = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: false,
    });

    if (pickerResult.canceled || !pickerResult.assets[0]) {
      return;
    }

    const asset = pickerResult.assets[0];
    const fileUri = `${FileSystem.cacheDirectory}/${asset.name}`;
    await FileSystem.copyAsync({
      from: asset.uri,
      to: fileUri,
    });

    const contents = await FileSystem.readAsStringAsync(fileUri);
    const wordsBak = YAML.parse(contents) as WordBak[];
    await setWords(wordsBakToWords(wordsBak));
  };

  const mergeTemplateContents = async (contents: string) => {
    const wordsBak = YAML.parse(contents) as WordBak[];
    let template = wordsBakToWords(wordsBak);
    await setWords([...words, ...template]);
  };

  return { createBackup, restoreBackup, mergeTemplateContents };
}
