import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Language } from '../../types';
import { NavigationProp, useNavigation } from '@react-navigation/native';

import { RootStackParamList } from '../../../App';
import { useWords } from '../../service/words';
import CommonWordDetailScreen from './CommonWordDetailScreen';

type CreateWordScreenProps = NavigationProp<RootStackParamList, 'createWord'>

export default function CreateWordScreen() {
  const { addWord } = useWords();
  const navigation = useNavigation<CreateWordScreenProps>();

  const [label, setLabel] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [uri, setUri] = useState(null);

  const onPressSave = () => {
    const word = {
      label,
      language,
      uri
    };

    addWord(word);

    navigation.navigate('Home');
  }

  return (
    <CommonWordDetailScreen
      label={label}
      language={language}
      uri={uri}
      onUpdateLabel={setLabel}
      onUpdateLanguage={setLanguage}
      onUpdateUri={setUri}
      onPressSave={onPressSave}
    />
  )
}
