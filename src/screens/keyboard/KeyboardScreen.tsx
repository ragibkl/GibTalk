import { StackScreenProps } from "@react-navigation/stack";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from "react-native-popup-menu";

import { HomeTabsParamList } from "../../../App";
import { LANGUAGE_OPTIONS, Language, speak } from "../../service/speech";

import IconButton from "../../components/IconButton";
import SafeAreaView from "../../components/SafeAreaView";

type KeyboardScreenProps = StackScreenProps<HomeTabsParamList, "TabKeyboard">;

export default function KeyboardScreen(props: KeyboardScreenProps) {
  const [textInput, setTextInput] = useState("");
  const [language, setLanguage] = useState<Language>("en");

  const onPressPlay = () => {
    speak(textInput, language);
  };

  const onPressClear = () => {
    setTextInput("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.bodyRow}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              onChangeText={setTextInput}
              value={textInput}
            />

            <Menu onSelect={setLanguage}>
              <MenuTrigger>
                <View style={styles.languageInputContainer}>
                  <Text style={styles.languageInput}>{language}</Text>
                </View>
              </MenuTrigger>
              <MenuOptions>
                {LANGUAGE_OPTIONS.map(({ language, label }) => (
                  <MenuOption key={language} value={language}>
                    <Text style={styles.languageOption}>
                      {`${language} - ${label}`}
                    </Text>
                  </MenuOption>
                ))}
              </MenuOptions>
            </Menu>
          </View>

          <View style={styles.controls}>
            <IconButton label="Play" icon="play" onPress={onPressPlay} />
            <IconButton
              style={{ marginLeft: 5 }}
              label="Clear All"
              icon="trash"
              onPress={onPressClear}
            />
          </View>
        </View>
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
  bodyRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 75,
  },
  textInputContainer: {
    alignItems: "center",
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 2,
    flex: 1,
    flexDirection: "row",
    height: 60,
    padding: 10,
    paddingLeft: 15,
  },
  textInput: {
    alignSelf: "stretch",
    flex: 1,
    fontSize: 30,
  },
  languageInputContainer: {
    alignItems: "center",
    backgroundColor: "lightgrey",
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    marginLeft: 5,
    width: 40,
  },
  languageInput: {
    fontSize: 12,
  },
  languageOption: {
    fontSize: 18,
  },
  controls: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 5,
  },
});
