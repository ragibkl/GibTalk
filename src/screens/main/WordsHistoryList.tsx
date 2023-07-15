import { ScrollView, StyleSheet } from "react-native"
import HistoryItem from "../../components/HistoryItem"
import { Word } from "../../types"

type Props = {
  words: Word[]
}

export default function WordsHistoryList(props: Props) {
  const renderHistoryItem = (word: Word, _i: number) => {
    return (
      <HistoryItem key={word.id} word={word} />
    )
  }

  return (
    <ScrollView horizontal contentContainerStyle={styles.content}>
      {props.words.map(renderHistoryItem)}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
  },
});
