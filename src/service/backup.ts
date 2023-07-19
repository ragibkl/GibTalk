import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import { useWords } from "./words";

export function useBackup() {
  const { words, setWords } = useWords();

  const createBackup = async () => {
    const fileUri = `${FileSystem.documentDirectory}/gibtalk.bak`;
    const contents = JSON.stringify(words);
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
    const words = JSON.parse(contents);
    setWords(words);
  };

  return { createBackup, restoreBackup };
}
