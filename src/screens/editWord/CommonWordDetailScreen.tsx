import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Language } from '../../types';

type Props = {
  label: string,
  language: string,
  uri: string,
  onUpdateLabel: (label: string) => void,
  onUpdateLanguage: (language: Language) => void,
  onUpdateUri: (uri: string) => void,
  onPressSave: () => void,
}

export default function CommonWordDetailScreen(props: Props) {
  const {
    label,
    language,
    uri,
    onUpdateLabel,
    onUpdateLanguage,
    onUpdateUri,
    onPressSave,
  } = props;

  const onLanguageValueChange = (value: Language, _index: number) => {
    onUpdateLanguage(value);
  }

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

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.rowInput}>
          <Text style={styles.inputTitle}>Label</Text>
          <TextInput style={styles.labelInput} onChangeText={onUpdateLabel} value={label} />
        </View>

        <View style={styles.rowInput}>
          <Text style={styles.inputTitle}>Language</Text>

          <Picker
            selectedValue={language}
            onValueChange={onLanguageValueChange}
            style={styles.labelInput}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Bahasa" value="ms" />
            <Picker.Item label="Chinese" value="zh" />
          </Picker>
        </View>

        <View style={styles.rowInput}>
          <Text style={styles.inputTitle}>Image</Text>
          <Pressable
            style={styles.button}
            onPress={onPressSelectImage}
          >
            <Text>Select an Image</Text>
          </Pressable>
        </View>

        <View style={styles.rowInput}>
          <Pressable
            style={styles.saveButton}
            onPress={onPressSave}
          >
            <Text>Save</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.right}>
        <Image style={styles.image} source={{ uri }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'stretch',
    padding: 10,
  },
  left: {
    flex: 1,
  },
  right: {
    flex: 1,
  },
  image: {
    width: 200,
    height: 200,
  },
  rowInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputTitle: {
    width: 100,
  },
  labelInput: {
    height: 40,
    width: 200,
    padding: 5,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
  },
  button: {
    height: 40,
    width: 200,
    padding: 5,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: 'yellow',
    alignItems: 'center',
  },
  saveButton: {
    height: 40,
    width: 90,
    padding: 5,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: 'lightgreen',
    alignItems: 'center',
  },
})
