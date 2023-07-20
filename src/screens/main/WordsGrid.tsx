import { ScrollView, StyleSheet } from "react-native";

import WordItem from "../../components/WordItem";
import { Word, useWords } from "../../service/words";

type Props = {
  editWord: (word: Word) => void;
  isEditing: boolean;
};

export default function WordsGrid(props: Props) {
  const { wordsInPath } = useWords();

  const renderWordItem = (word: Word) => {
    return (
      <WordItem
        key={word.id}
        word={word}
        editWord={props.editWord}
        isEditing={props.isEditing}
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {wordsInPath.map(renderWordItem)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
