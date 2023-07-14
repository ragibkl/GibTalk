import { useState } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

import { Language } from '../../types';

import { RootStackParamList } from '../../../App';
import { useWords } from '../../service/words';
import CommonWordDetailScreen from './CommonWordDetailScreen';

type EditWordNavigationProps = NavigationProp<RootStackParamList, 'editWord'>
type EditWordScreenProps = StackScreenProps<RootStackParamList, 'editWord'>

export default function EditWordScreen(props: EditWordScreenProps) {
  const prevWord = props.route.params.word;
  const { updateWord } = useWords();
  const navigation = useNavigation<EditWordNavigationProps>();

  const [label, setLabel] = useState(prevWord.label);
  const [language, setLanguage] = useState<Language>(prevWord.language);
  const [uri, setUri] = useState(prevWord.uri);

  const onPressSave = () => {
    const word = {
      id: prevWord.id,
      label,
      language,
      uri
    };

    updateWord(word);

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
