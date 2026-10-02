import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, View, Image } from "react-native";

import PressableOpacity from "./PressableOpacity";
import { speakWord } from "../service/speech";
import { useWords, Word } from "../service/words";
import { useHistory } from "../service/history";
import { useWordPath } from "../service/wordPath";
import { useClipboard } from "../service/clipboard";

type Props = {
  word: Word;
  isEditing: boolean;
  editWord: (word: Word) => void;
};

export default function WordItem({ word, editWord, isEditing }: Props) {
  const { removeWord } = useWords();
  const { addWordToPath } = useWordPath();
  const { addWordToHistory } = useHistory();
  const { copyWord } = useClipboard();

  const onPressWord = () => {
    speakWord(word);
    addWordToPath(word);

    if (!isEditing) {
      addWordToHistory(word);
    }
  };

  const onPressEdit = () => {
    editWord(word);
  };

  const onPressCopy = () => {
    copyWord(word);
  };

  const onPressRemove = () => {
    removeWord(word.id);
  };

  return (
    <PressableOpacity onPress={onPressWord} testID={`word-${word.label}`}>
      <View style={[styles.container, !!word.children && styles.category]}>
        <Image style={styles.image} source={{ uri: word.uri }} />
        <Text style={styles.labelText}>{word.label}</Text>
      </View>

      {isEditing && (
        <>
          <View style={styles.editContainer}>
            <PressableOpacity onPress={onPressEdit}>
              <FontAwesome style={styles.editIcon} size={20} name="edit" />
            </PressableOpacity>
          </View>

          <View style={styles.copyContainer}>
            <PressableOpacity onPress={onPressCopy}>
              <FontAwesome style={styles.copyIcon} size={25} name="copy" />
            </PressableOpacity>
          </View>

          <View style={styles.deleteContainer}>
            <PressableOpacity onPress={onPressRemove}>
              <FontAwesome style={styles.deleteIcon} size={25} name="remove" />
            </PressableOpacity>
          </View>

        </>
      )}
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "lightgreen",
    borderRadius: 10,
    borderWidth: 2,
    margin: 5,
    width: 150,
  },
  category: {
    backgroundColor: "yellow",
  },
  image: {
    backgroundColor: "white",
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 2,
    height: 100,
    marginTop: 15,
    width: 100,
  },
  labelText: {
    margin: 5,
    fontWeight: "bold",
  },
  editContainer: {
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "black",
    borderRadius: 15,
    borderWidth: 2,
    height: 30,
    justifyContent: "center",
    left: 5,
    position: "absolute",
    top: 5,
    width: 30,
  },
  editIcon: {
    color: "black",
  },
  copyContainer: {
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "black",
    borderRadius: 15,
    borderWidth: 2,
    height: 30,
    justifyContent: "center",
    left: 40,
    position: "absolute",
    top: 5,
    width: 30,
  },
  copyIcon: {
    color: "black",
  },
  deleteContainer: {
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "black",
    borderRadius: 15,
    borderWidth: 2,
    height: 30,
    justifyContent: "center",
    position: "absolute",
    right: 5,
    top: 5,
    width: 30,
  },
  deleteIcon: {
    color: "black",
  },
});
