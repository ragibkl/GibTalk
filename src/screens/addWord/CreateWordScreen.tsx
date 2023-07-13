import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Language, Word } from '../../types';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '../../../App';

type CreateWordScreenProps = NavigationProp<RootStackParamList, 'createWord'>

export default function CreateWordScreen() {
  const [label, setLabel] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [uri, setUri] = useState(null);
  const navigation = useNavigation<CreateWordScreenProps>();

  const onLanguageValueChange = (value: Language, _index: number) => {
    setLanguage(value);
  }

  const onPressSelectImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (result.assets[0]) {
      setUri(result.assets[0].uri);
    }
  };

  const onPressSave = () => {
    const word: Word = {
      id: 'abc123',
      label,
      language,
      uri
    };

    // TODO: Add to words list
    console.log(word);

    navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.rowInput}>
          <Text style={styles.inputTitle}>Label</Text>
          <TextInput style={styles.labelInput} onChangeText={setLabel}/>
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
        <Image style={styles.image} source={{ uri: uri }} />
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
