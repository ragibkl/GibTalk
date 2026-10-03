import { FontAwesome } from "@expo/vector-icons";
import { StyleSheet, Text, View, Image } from "react-native";

import PressableOpacity from "./PressableOpacity";
import { speakWord } from "../service/speech";
import { useWords, Word } from "../service/words";
import { useHistory } from "../service/history";
import { useWordPath } from "../service/wordPath";
import { useClipboard } from "../service/clipboard";

// Full-size tile height including margins (label on one line).
export const TILE_HEIGHT = 160;
// Full-size tile width, and the margin around it (5 on each side).
export const TILE_WIDTH = 150;
export const TILE_MARGIN = 10;

type Props = {
  word: Word;
  isEditing: boolean;
  editWord: (word: Word) => void;
  // 1 = full size (tablets); smaller on phones.
  scale?: number;
};

export default function WordItem({
  word,
  editWord,
  isEditing,
  scale = 1,
}: Props) {
  const sized = {
    container: { width: TILE_WIDTH * scale },
    image: {
      width: 100 * scale,
      height: 100 * scale,
      marginTop: 15 * scale,
    },
    label: { fontSize: Math.max(12, Math.round(14 * scale)) },
  };

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
      <View
        style={[
          styles.container,
          sized.container,
          !!word.children && styles.category,
        ]}
      >
        <Image style={[styles.image, sized.image]} source={{ uri: word.uri }} />
        <Text style={[styles.labelText, sized.label]} numberOfLines={2}>
          {word.label}
        </Text>
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
    textAlign: "center",
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
