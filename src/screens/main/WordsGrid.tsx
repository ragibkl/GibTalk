import { useState } from "react";
import { LayoutChangeEvent, ScrollView, StyleSheet, View } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import Sortable, { SortableFlexDragEndParams } from "react-native-sortables";

import WordItem, { TILE_HEIGHT } from "../../components/WordItem";
import { Word, useWords } from "../../service/words";

type Props = {
  editWord: (word: Word) => void;
  isEditing: boolean;
};

export default function WordsGrid(props: Props) {
  const { wordsInPath, moveWord } = useWords();
  const scrollableRef = useAnimatedRef<Animated.ScrollView>();
  const [height, setHeight] = useState(0);

  // Shrink tiles so at least two rows fit (phones in landscape). Tablets keep
  // full size. Edit mode stays bigger so the buttons on each tile are easy to tap.
  const minScale = props.isEditing ? 0.8 : 0.6;
  const fit = height ? height / (2 * TILE_HEIGHT) : 1;
  const scale = Math.min(1, Math.max(minScale, fit));

  const onLayout = (e: LayoutChangeEvent) => {
    setHeight(e.nativeEvent.layout.height);
  };

  const renderWordItem = (word: Word) => {
    return (
      <WordItem
        key={word.id}
        word={word}
        editWord={props.editWord}
        isEditing={props.isEditing}
        scale={scale}
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
      <View style={styles.container} onLayout={onLayout}>
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
      </View>
    );
  }

  return (
    <View style={styles.container} onLayout={onLayout}>
      <ScrollView contentContainerStyle={styles.content}>
        {wordsInPath.map(renderWordItem)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
