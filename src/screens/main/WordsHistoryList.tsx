import { ScrollView, StyleSheet } from "react-native";

import HistoryItem from "../../components/HistoryItem";
import { Word } from "../../service/words";

type Props = {
  words: Word[];
};

export default function WordsHistoryList(props: Props) {
  const renderHistoryItem = (word: Word, i: number) => {
    return <HistoryItem key={i} word={word} />;
  };

  return (
    <ScrollView horizontal contentContainerStyle={styles.content}>
      {props.words.map(renderHistoryItem)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
  },
});
