import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import {
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { LANGUAGE_OPTIONS, Language } from "../../service/speech";

const placeholderImage = require("../../../assets/placeholder.png");

type Props = {
  label: string;
  language: string;
  isCategory: boolean;
  uri: string | null;
  onUpdateLabel: (label: string) => void;
  onUpdateLanguage: (language: Language) => void;
  onUpdateIsCategory: (isCategory: boolean) => void;
  onUpdateUri: (uri: string) => void;
  onPressSave: () => void;
};

export default function CommonWordDetailScreen(props: Props) {
  const {
    label,
    language,
    isCategory,
    uri,
    onUpdateLabel,
    onUpdateLanguage,
    onUpdateIsCategory,
    onUpdateUri,
    onPressSave,
  } = props;

  const onLanguageValueChange = (value: Language, _index: number) => {
    onUpdateLanguage(value);
  };

  const onPressSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      onUpdateUri(result.assets[0].uri);
    }
  };

  const saveDisabled = !label.trim() || !language || !uri;

  const source = !!uri ? { uri } : placeholderImage;

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.rowInput}>
          <Text style={styles.inputTitle}>Label</Text>
          <TextInput
            style={styles.labelInput}
            onChangeText={onUpdateLabel}
            value={label}
          />
        </View>

        <View style={styles.rowInput}>
          <Text style={styles.inputTitle}>Language</Text>

          <Picker
            selectedValue={language}
            onValueChange={onLanguageValueChange}
            style={styles.labelInput}
          >
            {LANGUAGE_OPTIONS.map(({ label, language }) => (
              <Picker.Item key={label} label={label} value={language} />
            ))}
          </Picker>
        </View>

        <View style={styles.rowInput}>
          <Text style={styles.inputTitle}>Category?</Text>
          <Switch value={isCategory} onValueChange={onUpdateIsCategory} />
        </View>

        <View style={styles.rowInput}>
          <Text style={styles.inputTitle}>Image</Text>
          <Pressable style={styles.button} onPress={onPressSelectImage}>
            <Text>Select an Image</Text>
          </Pressable>
        </View>

        <View style={styles.rowInput}>
          <Pressable
            style={[
              styles.saveButton,
              saveDisabled && styles.saveButtonDisabled,
            ]}
            onPress={onPressSave}
            disabled={saveDisabled}
          >
            <Text>Save</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.right}>
        <Image style={styles.image} source={source} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignSelf: "stretch",
    padding: 10,
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 1,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "black",
  },
  rowInput: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  inputTitle: {
    width: 100,
  },
  labelInput: {
    height: 40,
    width: 230,
    padding: 5,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
  },
  button: {
    height: 40,
    width: 200,
    padding: 5,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: "yellow",
    alignItems: "center",
  },
  saveButton: {
    height: 40,
    width: 90,
    padding: 5,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: "lightgreen",
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
});
