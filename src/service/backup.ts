import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";
import uuid from "react-native-uuid";
import YAML from "yaml";

import { Word, useWords } from "./words";
import { Language, normalizeLanguage } from "./speech";

type WordBak = {
  label: string;
  uri: string;
  language: Language;
  children?: WordBak[];
};

// Parses a backup or word file (from the app's Backup, or the website's
// template builder) and checks every word has a label and a picture.
export function parseWordFile(contents: string): WordBak[] {
  const bad = new Error(
    "This doesn't look like a GibTalk word file. Use a file made with Backup or the template builder at gibtalk.com.",
  );

  let data: unknown;
  try {
    data = YAML.parse(contents);
  } catch {
    throw bad;
  }

  const valid = (words: unknown): boolean =>
    Array.isArray(words) &&
    words.every(
      (w) =>
        w &&
        typeof w.label === "string" &&
        typeof w.uri === "string" &&
        (w.children === undefined || w.children === null || valid(w.children)),
    );

  if (!Array.isArray(data) || !data.length || !valid(data)) {
    throw bad;
  }
  return data as WordBak[];
}

async function pickFileContents(): Promise<string | null> {
  const pickerResult = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
  });

  if (pickerResult.canceled || !pickerResult.assets[0]) {
    return null;
  }

  const file = new FileSystem.File(pickerResult.assets[0].uri);
  return file.textSync();
}

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
    language: normalizeLanguage(wordBak.language),
    children: wordBak.children ? wordsBakToWords(wordBak.children) : undefined,
  }));
}

export function useBackup() {
  const { words, setWords } = useWords();

  const createBackup = async () => {
    const contents = YAML.stringify(wordsToWordsBak(words));

    if (Platform.OS === "ios") {
      const file = new FileSystem.File(
        FileSystem.Paths.document,
        "gibtalk-bak.yaml",
      );
      file.write(contents);

      Sharing.shareAsync(file.uri, { UTI: "public.item" });
    } else if (Platform.OS === "android") {
      const file = new FileSystem.File(
        FileSystem.Paths.document,
        "gibtalk-bak.yaml",
      );
      file.write(contents);

      Sharing.shareAsync(file.uri);
    }
  };

  const restoreBackup = async () => {
    const contents = await pickFileContents();
    if (contents === null) {
      return;
    }

    const wordsBak = YAML.parse(contents) as WordBak[];
    await setWords(wordsBakToWords(wordsBak));
  };

  const mergeTemplateContents = async (contents: string) => {
    const wordsBak = YAML.parse(contents) as WordBak[];
    let template = wordsBakToWords(wordsBak);
    await setWords([...words, ...template]);
  };

  // Adds the words from a file to the board, like a template. Returns false
  // if no file was picked; throws if the file isn't a word file.
  const importFromFile = async (): Promise<boolean> => {
    const contents = await pickFileContents();
    if (contents === null) {
      return false;
    }

    const template = wordsBakToWords(parseWordFile(contents));
    await setWords([...words, ...template]);
    return true;
  };

  return { createBackup, restoreBackup, mergeTemplateContents, importFromFile };
}
