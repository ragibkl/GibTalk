import { useState } from "react";
import { NavigationProp, useNavigation } from "@react-navigation/native";

import { RootStackParamList } from "../../../App";
import { CreateWord, useWords } from "../../service/words";
import { Language } from "../../service/speech";

import CommonWordDetailScreen from "./CommonWordDetailScreen";

type CreateWordScreenProps = NavigationProp<RootStackParamList, "createWord">;

export default function CreateWordScreen() {
  const { addWord } = useWords();
  const navigation = useNavigation<CreateWordScreenProps>();

  const [label, setLabel] = useState("");
  const [language, setLanguage] = useState<Language>("en");
  const [uri, setUri] = useState(null);
  const [isCategory, setIsCategory] = useState(false);

  const onPressSave = () => {
    const word: CreateWord = {
      label,
      language,
      uri,
    };

    if (isCategory) {
      word.children = [];
    }

    addWord(word);

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
