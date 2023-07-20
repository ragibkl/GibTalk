import { useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

import { RootStackParamList } from "../../../App";
import { Language } from "../../service/speech";
import { useWords, Word } from "../../service/words";

import CommonWordDetailScreen from "./CommonWordDetailScreen";

type EditWordNavigationProps = NavigationProp<RootStackParamList, "editWord">;
type EditWordScreenProps = StackScreenProps<RootStackParamList, "editWord">;

export default function EditWordScreen(props: EditWordScreenProps) {
  const prevWord = props.route.params.word;
  const { updateWord } = useWords();
  const navigation = useNavigation<EditWordNavigationProps>();

  const [label, setLabel] = useState(prevWord.label);
  const [language, setLanguage] = useState<Language>(prevWord.language);
  const [uri, setUri] = useState(prevWord.uri);
  const [isCategory, setIsCategory] = useState(!!prevWord.children);

  const onPressSave = () => {
    const word: Word = {
      id: prevWord.id,
      label,
      language,
      uri,
    };

    if (isCategory) {
      word.children = prevWord.children || [];
    }

    updateWord(word);

    navigation.navigate("Home");
  };

  return (
    <CommonWordDetailScreen
      label={label}
      language={language}
      isCategory={isCategory}
      uri={uri}
      onUpdateLabel={setLabel}
      onUpdateLanguage={setLanguage}
      onUpdateIsCategory={setIsCategory}
      onUpdateUri={setUri}
      onPressSave={onPressSave}
    />
  );
}
