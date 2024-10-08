import { FontAwesome } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

import { LANGUAGE_OPTIONS, Language, speak } from "../../service/speech";
import { RootStackParamList } from "../../../App";
import { useState } from "react";
import SafeAreaView from "../../components/SafeAreaView";

const placeholderImage = require("../../../assets/placeholder.png");

const LANGUAGE_ITEMS = LANGUAGE_OPTIONS.map(({ label, language }) => ({
  label,
  value: language,
}));

type EditWordNavigationProps = NavigationProp<RootStackParamList, "editWord">;

type LanguagePickerProps = {
  language: Language;
  onChangeLanguage(language: Language): void;
};

function LanguagePicker(props: LanguagePickerProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Language>(props.language);

  const onChangeValue = (value: Language | null) => {
    props.onChangeLanguage(value || props.language);
  };

  return (
    <DropDownPicker
      items={LANGUAGE_ITEMS}
      open={open}
      value={value}
      setOpen={setOpen}
      setValue={setValue}
      onChangeValue={onChangeValue}
    />
  );
}

type Props = {
  label: string;
  language: Language;
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

  const navigation = useNavigation<EditWordNavigationProps>();
  const [_cameraPermission, requestCameraPermission] =
    ImagePicker.useCameraPermissions();

  const onLanguageValueChange = (value: Language) => {
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
    const response = await requestCameraPermission();

    if (!response.granted) {
      Alert.alert(
        "Camera Permission Error",
        "Please allow the app to access the camera",
      );
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      onUpdateUri(result.assets[0].uri);
    }
  };

  const onPressSearch = () => {
    navigation.navigate("searchImage", { onUpdateUri });
  };

  const onPressImage = () => {
    speak(label, language);
  };

  const saveDisabled = !label.trim() || !language || !uri;

  const source = !!uri ? { uri } : placeholderImage;

  return (
    <SafeAreaView style={styles.safeArea}>
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
          </View>

          <LanguagePicker
            language={language}
            onChangeLanguage={onLanguageValueChange}
          />
          <View style={styles.rowInput} />

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

              <Pressable
                style={styles.imageButton}
                onPress={onPressSelectImage}
              >
                <FontAwesome name="picture-o" size={20} />
              </Pressable>

              <Pressable style={styles.imageButton} onPress={onPressCamera}>
                <FontAwesome name="camera" size={20} />
              </Pressable>

              <Pressable style={styles.imageButton} onPress={onPressSearch}>
                <FontAwesome name="search" size={20} />
              </Pressable>
            </View>

            <Pressable onPress={onPressImage}>
              <Image style={styles.image} source={source} />
            </Pressable>
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
    flexDirection: "row",
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
    backgroundColor: "white",
    borderColor: "black",
    borderRadius: 20,
    borderWidth: 2,
    height: 220,
    marginTop: 10,
    width: 220,
  },
});
