import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useBackup } from "../../service/backup";
import { useHistory } from "../../service/history";
import { speakWord, stopSpeech } from "../../service/speech";
import { Word, useWords } from "../../service/words";
import { useWordPath } from "../../service/wordPath";

import { RootStackParamList } from "../../../App";
import IconButton from "../../components/IconButton";
import { ProgressIcon } from "../../components/ProgressIcon";
import SafeAreaView from "../../components/SafeAreaView";

import PasscodeModal from "./PasscodeModal";
import WordsEmptyGrid from "./WordsEmptyGrid";
import WordsGrid from "./WordsGrid";
import WordsHistoryList from "./WordsHistoryList";
import { useClipboard } from "../../service/clipboard";

type HomeScreenNavigationProps = NavigationProp<RootStackParamList, "Home">;

export default function MainScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasscodeModal, setPasscodeModal] = useState(false);

  const navigation = useNavigation<HomeScreenNavigationProps>();
  const { createBackup, restoreBackup } = useBackup();
  const { popToTop, pop } = useWordPath();
  const { words, isFetching } = useWords();
  const { history, clearHistory } = useHistory();
  const { clipboard, clearClipboard, pasteWords } = useClipboard();

  const onPressClear = () => {
    clearHistory();
    stopSpeech();
  };

  const onPressPlay = () => {
    history.forEach(speakWord);
  };

  const onPressEdit = () => {
    setPasscodeModal(true);
  };

  const onPasscodeModalOk = () => {
    setPasscodeModal(false);
    setIsEditing(true);
    clearHistory();
  };

  const editWord = (word: Word) => {
    navigation.navigate("editWord", { word });
  };

  const onPressBackup = () => {
    createBackup();
  };

  const onPressRestore = () => {
    restoreBackup();
  };

  const onPressTemplates = () => {
    navigation.navigate("searchTemplate");
  };

  const onPressAdd = () => {
    navigation.navigate("createWord");
  };

  const onPressSave = () => {
    setIsEditing(false);
    clearClipboard();
  };

  const onPressClearClipboard = () => {
    clearClipboard();
  };

  const onPressPaste = () => {
    pasteWords();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <View style={styles.bodyTop}>
          <View style={styles.historyContainer}>
            {isEditing ? (
              <>
                <Text style={styles.currentText}>Clipboard</Text>
                <WordsHistoryList words={clipboard} />
              </>
            ) : (
              <>
                <Text style={styles.currentText}>Words history</Text>
                <WordsHistoryList words={history} />
              </>
            )}
          </View>

          <View style={styles.controls}>
            {isEditing ? (
              <>
                <IconButton
                  label="Clear All"
                  icon="trash"
                  onPress={onPressClearClipboard}
                />
                <IconButton
                  style={{ marginLeft: 5 }}
                  label="Paste"
                  icon="paste"
                  onPress={onPressPaste}
                />
                <IconButton
                  style={{ marginLeft: 5 }}
                  label="Home"
                  icon="home"
                  onPress={popToTop}
                />
                <IconButton
                  style={{ marginLeft: 5 }}
                  label="Back"
                  icon="arrow-left"
                  onPress={pop}
                />
              </>
            ) : (
              <>
                <IconButton label="Play" icon="play" onPress={onPressPlay} />
                <IconButton
                  style={{ marginLeft: 5 }}
                  label="Clear All"
                  icon="trash"
                  onPress={onPressClear}
                />
                <IconButton
                  style={{ marginLeft: 5 }}
                  label="Home"
                  icon="home"
                  onPress={popToTop}
                />
                <IconButton
                  style={{ marginLeft: 5 }}
                  label="Back"
                  icon="arrow-left"
                  onPress={pop}
                />
              </>
            )}
          </View>
        </View>

        <View style={styles.bodyBottom}>
          <View style={styles.gridContainer}>
            {!!isFetching ? (
              <ProgressIcon />
            ) : !!words.length ? (
              <WordsGrid editWord={editWord} isEditing={isEditing} />
            ) : (
              <WordsEmptyGrid />
            )}
          </View>

          <View style={styles.sideControls}>
            <View style={{ flex: 1 }} />
            {isEditing ? (
              <>
                <IconButton
                  label="Backup"
                  icon="download"
                  onPress={onPressBackup}
                />
                <IconButton
                  label="Restore"
                  icon="upload"
                  onPress={onPressRestore}
                />
                <IconButton
                  label="Templates"
                  icon="book"
                  onPress={onPressTemplates}
                />
                <IconButton label="Add" icon="plus" onPress={onPressAdd} />
                <IconButton label="Done" icon="check" onPress={onPressSave} />
              </>
            ) : (
              <IconButton label="Edit" icon="edit" onPress={onPressEdit} />
            )}
          </View>
        </View>

        <PasscodeModal
          visible={showPasscodeModal}
          setVisible={setPasscodeModal}
          onOk={onPasscodeModalOk}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  body: {
    flex: 1,
    padding: 5,
  },
  bodyTop: {
    flexDirection: "row",
    height: 75,
  },
  historyContainer: {
    flex: 1,
  },
  currentText: {
    alignSelf: "center",
    marginTop: 25,
    position: "absolute",
  },
  controls: {
    alignItems: "center",
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
    flex: 1,
  },
  sideControls: {
    alignItems: "flex-end",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    marginLeft: 5,
  },
});
