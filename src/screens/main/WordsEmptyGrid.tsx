import { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { fetchCoreWords } from "../../api/templateSearch";
import { useBackup } from "../../service/backup";

import PressableOpacity from "../../components/PressableOpacity";

// An empty Home (a new install, or after removing every word) offers the core
// words with one tap, so there's something to talk with straight away.
export default function WordsEmptyGrid() {
  const { addTemplateToHome } = useBackup();
  const [loading, setLoading] = useState<"en" | "ms" | null>(null);
  const [failed, setFailed] = useState(false);

  const onPressCore = async (language: "en" | "ms") => {
    if (loading) {
      return;
    }
    setLoading(language);
    setFailed(false);
    try {
      await addTemplateToHome(await fetchCoreWords(language));
    } catch {
      setFailed(true);
    } finally {
      setLoading(null);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }} />
      <Text style={styles.title}>Start with the core words</Text>
      <Text style={styles.text}>
        36 everyday words (want, more, help, finished, go…) that work in any
        situation. You can change or remove any of them later.
      </Text>

      <View style={styles.buttons}>
        <PressableOpacity
          style={styles.button}
          onPress={() => onPressCore("en")}
          testID="add-core-en"
        >
          {loading === "en" ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>Add core words (English)</Text>
          )}
        </PressableOpacity>
        <PressableOpacity
          style={styles.button}
          onPress={() => onPressCore("ms")}
          testID="add-core-ms"
        >
          {loading === "ms" ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.buttonText}>Tambah kata teras (Melayu)</Text>
          )}
        </PressableOpacity>
      </View>

      {failed && (
        <Text style={styles.error}>
          Couldn't download the core words. Check the internet connection and
          try again.
        </Text>
      )}

      <Text style={styles.text}>
        Or tap Edit to add your own words, or Edit → More for templates and
        restoring a backup.
      </Text>
      <View style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    textAlign: "center",
    marginVertical: 8,
  },
  buttons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    marginVertical: 12,
  },
  button: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    minWidth: 220,
    alignItems: "center",
    backgroundColor: "#fff59d",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "#b00020",
    textAlign: "center",
    marginVertical: 4,
  },
});
