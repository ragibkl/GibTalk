import { ScrollView, StyleSheet } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import Sortable, { SortableFlexDragEndParams } from "react-native-sortables";

import WordItem from "../../components/WordItem";
import { Word, useWords } from "../../service/words";

type Props = {
  editWord: (word: Word) => void;
  isEditing: boolean;
};

export default function WordsGrid(props: Props) {
  const { wordsInPath, moveWord } = useWords();
  const scrollableRef = useAnimatedRef<Animated.ScrollView>();

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

  // In edit mode, press and hold a word to drag it to a new place.
  if (props.isEditing) {
    // Use the indexes: the library prefixes the React keys it reports.
    const onDragEnd = ({ fromIndex, toIndex }: SortableFlexDragEndParams) => {
      const word = wordsInPath[fromIndex];
      if (word && fromIndex !== toIndex) {
        moveWord(word.id, toIndex);
      }
    };

    return (
      <Animated.ScrollView ref={scrollableRef}>
        <Sortable.Flex
          flexDirection="row"
          flexWrap="wrap"
          scrollableRef={scrollableRef}
          onDragEnd={onDragEnd}
        >
          {wordsInPath.map(renderWordItem)}
        </Sortable.Flex>
      </Animated.ScrollView>
    );
  }

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
