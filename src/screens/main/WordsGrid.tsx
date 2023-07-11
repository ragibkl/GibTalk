import { ScrollView, StyleSheet } from "react-native"

import WordItem from "../../components/WordItem"

import { Word } from "../../types"

type Props = {
  addWordToHistory(word: Word): void,
  removeWord(word: Word): void,
  moveWordLeft(word: Word): void,
  moveWordRight(word: Word): void,
  words: Word[],
  isEditing: boolean,
}

export default function WordsGrid(props: Props) {
  const renderWordItem = (word: Word) => {
    return (
      <WordItem
        key={word.label}
        word={word}
        onPress={() => props.addWordToHistory(word)}
        onPressRemove={() => props.removeWord(word)}
        onPressLeft={() => props.moveWordLeft(word)}
        onPressRight={() => props.moveWordRight(word)}
        isEditing={props.isEditing}
      />
    )
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {props.words.map(renderWordItem)}
    </ScrollView>
  )

}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
