import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View, Image } from "react-native";

import PressableOpacity from "./PressableOpacity";
import { speakWord } from "../service/speech";
import { useWords, Word } from "../service/words";
import { useHistory } from "../service/history";
import { useWordPath } from "../service/wordPath";

type Props = {
  word: Word;
  isEditing: boolean;
  editWord: (word: Word) => void;
};

export default function WordItem({ word, editWord, isEditing }: Props) {
  const { removeWord, moveWordLeft, moveWordRight } = useWords();
  const { addWordToPath } = useWordPath();
  const { addWordToHistory } = useHistory();

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

  const onPressRemove = () => {
    removeWord(word.id);
  };

  const onPressMoveLeft = () => {
    moveWordLeft(word.id);
  };

  const onPressMoveRight = () => {
    moveWordRight(word.id);
  };

  return (
    <PressableOpacity onPress={onPressWord}>
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

          <View style={styles.deleteContainer}>
            <PressableOpacity onPress={onPressRemove}>
              <FontAwesome style={styles.deleteIcon} size={25} name="remove" />
            </PressableOpacity>
          </View>

          <View style={[styles.moveLeftContainer, styles.moveContainer]}>
            <PressableOpacity onPress={onPressMoveLeft}>
              <MaterialIcons
                style={styles.moveIcon}
                size={20}
                name="arrow-left"
              />
            </PressableOpacity>
          </View>

          <View style={[styles.moveRightContainer, styles.moveContainer]}>
            <PressableOpacity onPress={onPressMoveRight}>
              <MaterialIcons
                style={styles.moveIcon}
                size={20}
                name="arrow-right"
              />
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
    // borderColor: "white",
    borderRadius: 10,
    borderWidth: 2,
    margin: 5,
    width: 120,
  },
  category: {
    backgroundColor: "yellow",
  },
  image: {
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 2,
    height: 80,
    marginTop: 15,
    width: 80,
  },
  labelText: {
    margin: 5,
    // color: "white",
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
  moveContainer: {
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 2,
    height: 25,
    justifyContent: "center",
    position: "absolute",
    top: 60,
    width: 25,
  },
  moveLeftContainer: {
    left: 10,
  },
  moveRightContainer: {
    right: 10,
  },
  moveIcon: {
    color: "black",
  },
});
