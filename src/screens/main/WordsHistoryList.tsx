import { useRef } from "react";
import { ScrollView, StyleSheet } from "react-native";

import HistoryItem from "../../components/HistoryItem";
import { Word } from "../../service/words";

type Props = {
  words: Word[];
};

export default function WordsHistoryList(props: Props) {
  const scrollRef = useRef<ScrollView>(null);

  const renderHistoryItem = (word: Word, i: number) => {
    return <HistoryItem key={i} word={word} />;
  };

  // Keep the newest word in view; older words scroll off to the left.
  const onContentSizeChange = () => {
    scrollRef.current?.scrollToEnd({ animated: true });
  };

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      contentContainerStyle={styles.content}
      onContentSizeChange={onContentSizeChange}
    >
      {props.words.map(renderHistoryItem)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
  },
});
