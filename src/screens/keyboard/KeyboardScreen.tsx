import { Picker } from "@react-native-picker/picker";
import { StackScreenProps } from "@react-navigation/stack";
import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { HomeTabsParamList } from "../../../App";
import { LANGUAGE_OPTIONS, Language, speak } from "../../service/speech";

import IconButton from "../../components/IconButton";

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
    <View style={styles.container}>
      <View style={styles.bodyRow}>
        <TextInput
          style={styles.textInput}
          onChangeText={setTextInput}
          value={textInput}
        />

        <Picker
          selectedValue={language}
          onValueChange={setLanguage}
          style={styles.languageInput}
        >
          {LANGUAGE_OPTIONS.map(({ language }) => (
            <Picker.Item key={language} label={language} value={language} />
          ))}
        </Picker>

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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignSelf: "stretch",
    padding: 10,
  },
  bodyRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 75,
  },
  textInput: {
    flex: 1,
    fontSize: 30,
    height: 60,
    padding: 5,
    paddingLeft: 15,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
  },
  languageInput: {
    height: 75,
    width: 120,
  },
  controls: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 5,
  },
});
