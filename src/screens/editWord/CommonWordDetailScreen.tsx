import { FontAwesome } from "@expo/vector-icons";
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

  const onPressCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
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
        <View style={styles.imageInput}>
          <View style={styles.imageButtonRow}>
            <Text>Select Image: </Text>

            <Pressable style={styles.imageButton} onPress={onPressSelectImage}>
              <FontAwesome name="picture-o" size={20} />
            </Pressable>

            <Pressable style={styles.imageButton} onPress={onPressCamera}>
              <FontAwesome name="camera" size={20} />
            </Pressable>
          </View>

          <Image style={styles.image} source={source} />
        </View>
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
  imageInput: {
    flexDirection: "column",
  },
  imageButtonRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  imageButton: {
    padding: 5,
    marginLeft: 10,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: "white",
    alignItems: "center",
  },
  image: {
    marginTop: 10,
    width: 220,
    height: 220,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "black",
  },
});
