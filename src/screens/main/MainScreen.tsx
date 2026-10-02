import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from "react-native-popup-menu";

import { useBackup } from "../../service/backup";
import {
  openAddVoice,
  useLanguageNames,
  useMissingLanguages,
} from "../../service/languages";
import { useClipboard } from "../../service/clipboard";
import { useHistory } from "../../service/history";
import { speakWords, stopSpeech } from "../../service/speech";
import { useWordPath } from "../../service/wordPath";
import { Word, useWords } from "../../service/words";

import { RootStackParamList } from "../../../App";
import IconButton from "../../components/IconButton";
import PressableOpacity from "../../components/PressableOpacity";
import { ProgressIcon } from "../../components/ProgressIcon";
import SafeAreaView from "../../components/SafeAreaView";

import BreadCrumbs from "./BreadCrumbs";
import PasscodeModal from "./PasscodeModal";
import WordsEmptyGrid from "./WordsEmptyGrid";
import WordsGrid from "./WordsGrid";
import WordsHistoryList from "./WordsHistoryList";

type HomeScreenNavigationProps = NavigationProp<RootStackParamList, "Home">;

export default function MainScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasscodeModal, setPasscodeModal] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const navigation = useNavigation<HomeScreenNavigationProps>();
  const { createBackup, restoreBackup } = useBackup();
  const { popToTop, pop } = useWordPath();
  const { words, isFetching } = useWords();
  const { history, clearHistory } = useHistory();
  const { clipboard, clearClipboard, pasteWords } = useClipboard();
  const missing = useMissingLanguages(words);
  const missingNames = useLanguageNames(missing);

  const onPressClear = () => {
    clearHistory();
    stopSpeech();
  };

  const onPressPlay = () => {
    speakWords(history);
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

  const onPressTemplates = () => {
    navigation.navigate("searchTemplate");
  };

  const onPressAdd = () => {
    navigation.navigate("createWord");
  };

  const onPressKeyboard = () => {
    navigation.navigate("keyboard");
  };

  const onMoreSelect = (action: () => void) => {
    setShowMore(false);
    action();
  };

  const onPressDone = () => {
    setIsEditing(false);
    clearClipboard();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.bodyTop}>
          <View style={styles.historyContainer}>
            {isEditing ? (
              <>
                {!clipboard.length && (
                  <Text style={styles.currentText}>Clipboard</Text>
                )}
                <WordsHistoryList words={clipboard} />
              </>
            ) : (
              <>
                {!history.length && (
                  <Text style={styles.currentText}>Words history</Text>
                )}
                <WordsHistoryList words={history} />
              </>
            )}
          </View>

          <View style={styles.controls}>
            {isEditing ? (
              <>
                {!!clipboard.length && (
                  <>
                    <IconButton
                      style={styles.button}
                      label="Paste"
                      icon="paste"
                      onPress={pasteWords}
                    />
                    <IconButton
                      style={styles.button}
                      label="Clear All"
                      icon="trash"
                      onPress={clearClipboard}
                    />
                  </>
                )}
              </>
            ) : (
              <>
                <IconButton
                  style={styles.button}
                  label="Play"
                  icon="play"
                  onPress={onPressPlay}
                />
                <IconButton
                  style={styles.button}
                  label="Clear All"
                  icon="trash"
                  onPress={onPressClear}
                />
              </>
            )}
            <IconButton
              style={styles.button}
              label="Home"
              icon="home"
              onPress={popToTop}
            />
            <IconButton
              style={styles.button}
              label="Back"
              icon="arrow-left"
              onPress={pop}
            />
            {isEditing ? (
              <>
                <IconButton
                  style={styles.button}
                  label="Add"
                  icon="plus"
                  onPress={onPressAdd}
                />
                <Menu
                  opened={showMore}
                  onBackdropPress={() => setShowMore(false)}
                >
                  <MenuTrigger disabled>
                    <IconButton
                      style={styles.button}
                      label="More"
                      icon="ellipsis-h"
                      onPress={() => setShowMore(true)}
                    />
                  </MenuTrigger>
                  <MenuOptions>
                    <MenuOption onSelect={() => onMoreSelect(onPressTemplates)}>
                      <Text style={styles.menuOption}>Templates</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => onMoreSelect(createBackup)}>
                      <Text style={styles.menuOption}>Backup</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => onMoreSelect(restoreBackup)}>
                      <Text style={styles.menuOption}>Restore</Text>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
                <IconButton
                  style={styles.button}
                  label="Done"
                  icon="check"
                  onPress={onPressDone}
                />
              </>
            ) : (
              <>
                <IconButton
                  style={styles.button}
                  label="Keyboard"
                  icon="keyboard-o"
                  onPress={onPressKeyboard}
                />
                <IconButton
                  style={styles.button}
                  label="Edit"
                  icon="edit"
                  onPress={onPressEdit}
                  alert={!!missing.length}
                />
              </>
            )}
          </View>
        </View>

        <View style={styles.bodyBreadcrumbs}>
          <BreadCrumbs />
        </View>

        {isEditing && !!missing.length && (
          <View style={styles.voiceNotice}>
            <Text style={styles.voiceNoticeText}>
              No voice on this device for {missingNames.join(", ")}. Words in{" "}
              {missing.length > 1 ? "these languages" : "this language"} are
              read in another language.
            </Text>
            <PressableOpacity
              style={styles.voiceNoticeButton}
              onPress={() => openAddVoice()}
            >
              <Text>Install voice</Text>
            </PressableOpacity>
          </View>
        )}

        <View style={styles.bodyBottom}>
          {!!isFetching ? (
            <ProgressIcon />
          ) : !!words.length ? (
            <WordsGrid editWord={editWord} isEditing={isEditing} />
          ) : (
            <WordsEmptyGrid />
          )}
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
  safeArea: {
    alignItems: "stretch",
    alignSelf: "stretch",
    backgroundColor: "white",
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 5,
  },
  bodyTop: {
    flexDirection: "row",
    height: 66,
  },
  historyContainer: {
    flex: 1,
  },
  currentText: {
    alignSelf: "center",
    marginTop: 22,
    position: "absolute",
  },
  controls: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 5,
  },
  button: {
    marginLeft: 5,
  },
  menuOption: {
    fontSize: 18,
    padding: 5,
  },
  voiceNotice: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    padding: 8,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#d32f2f",
    backgroundColor: "#fdecea",
  },
  voiceNoticeText: {
    flex: 1,
    marginRight: 10,
  },
  voiceNoticeButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: "white",
  },
  bodyBreadcrumbs: {
    paddingHorizontal: 10,
  },
  bodyBottom: {
    flex: 1,
    marginTop: 5,
  },
});
