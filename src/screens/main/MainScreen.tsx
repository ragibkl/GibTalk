import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import IconButton from "../../components/IconButton";
import { Word } from "../../types";
import { speakWord, stopSpeech } from "../../service/speech";
import WordsGrid from "./WordsGrid";
import WordsHistoryList from "./WordsHistoryList";
import { RootStackParamList } from "../../../App";

type HomeScreenProps = NavigationProp<RootStackParamList, "Home">;

export default function MainScreen() {
  const [wordsHistory, setHistoryItems] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const navigation = useNavigation<HomeScreenProps>();

  const onPressClear = () => {
    setHistoryItems([]);
    stopSpeech();
  };

  const onPressPlay = () => {
    wordsHistory.forEach(speakWord);
  };

  const addWordToHistory = (word: Word) => {
    if (wordsHistory.length) {
      const lastItem = wordsHistory[wordsHistory.length - 1];

      if (lastItem.id !== word.id) {
        setHistoryItems([...wordsHistory, word]);
      }
    } else {
      setHistoryItems([...wordsHistory, word]);
    }
  };

  const onPressEdit = () => {
    setIsEditing(true);
    setHistoryItems([]);
  };

  const editWord = (word: Word) => {
    navigation.navigate("editWord", { word });
  };

  const onPressAdd = () => {
    navigation.navigate("createWord");
  };

  const onPressSave = () => {
    setIsEditing(false);
  };

  return (
    <View style={styles.body}>
      <View style={styles.bodyTop}>
        <View style={styles.historyContainer}>
          <Text style={styles.currentText}>Drag downward to remove</Text>
          <WordsHistoryList words={wordsHistory} />
        </View>

        {!isEditing && (
          <View style={styles.controls}>
            <IconButton label="Play" icon="play" onPress={onPressPlay} />
            <IconButton
              style={{ marginLeft: 5 }}
              label="Clear All"
              icon="trash"
              onPress={onPressClear}
            />
          </View>
        )}
      </View>

      <View style={styles.bodyBottom}>
        <View style={styles.gridContainer}>
          <WordsGrid
            editWord={editWord}
            addWordToHistory={addWordToHistory}
            isEditing={isEditing}
          />
        </View>

        <View style={styles.sideControls}>
          {isEditing ? (
            <>
              <IconButton label="Add" icon="plus" onPress={onPressAdd} />
              <IconButton label="Save" icon="save" onPress={onPressSave} />
            </>
          ) : (
            <IconButton label="Edit" icon="edit" onPress={onPressEdit} />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: "orange",
    flex: 1,
    padding: 5,
  },
  bodyTop: {
    flexDirection: "row",
    height: 75,
  },
  historyContainer: {
    backgroundColor: "rgba(100, 100, 100, 0.5)",
    flex: 1,
  },
  currentText: {
    alignSelf: "center",
    marginTop: 25,
    position: "absolute",
  },
  controls: {
    alignItems: "center",
    backgroundColor: "rgba(100, 100, 100, 0.5)",
    flexDirection: "row",
    marginLeft: 5,
  },
  bodyBottom: {
    alignItems: "stretch",
    flex: 1,
    flexDirection: "row",
    marginTop: 5,
  },
  gridContainer: {
    backgroundColor: "rgba(100, 100, 100, 0.5)",
    flex: 1,
  },
  sideControls: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
    backgroundColor: "rgba(100, 100, 100, 0.5)",
    marginLeft: 5,
    width: 60,
  },
});
