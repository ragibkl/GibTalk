import { ScrollView, StyleSheet } from "react-native";

import WordItem from "../../components/WordItem";

import { Word } from "../../types";
import { useWords } from "../../service/words";

type Props = {
  addWordToHistory(word: Word): void;
  editWord: (word: Word) => void;
  isEditing: boolean;
};

export default function WordsGrid(props: Props) {
  const { words } = useWords();

  const renderWordItem = (word: Word) => {
    return (
      <WordItem
        key={word.id}
        word={word}
        addWordToHistory={props.addWordToHistory}
        editWord={props.editWord}
        isEditing={props.isEditing}
      />
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {words.map(renderWordItem)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
