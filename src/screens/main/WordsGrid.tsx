import { useState } from "react";
import { LayoutChangeEvent, ScrollView, StyleSheet, View } from "react-native";
import Animated, { useAnimatedRef } from "react-native-reanimated";
import Sortable, { SortableFlexDragEndParams } from "react-native-sortables";

import WordItem, {
  TILE_HEIGHT,
  TILE_MARGIN,
  TILE_WIDTH,
} from "../../components/WordItem";

const tileWidth = (scale: number) => TILE_WIDTH * scale + TILE_MARGIN;
import { Word, useWords } from "../../service/words";

type Props = {
  editWord: (word: Word) => void;
  isEditing: boolean;
};

export default function WordsGrid(props: Props) {
  const { wordsInPath, moveWord } = useWords();
  const scrollableRef = useAnimatedRef<Animated.ScrollView>();
  const [size, setSize] = useState({ width: 0, height: 0 });

  // Shrink tiles so at least two rows fit (phones in landscape); tablets keep
  // about full size. Then size them so each row fills the width exactly.
  // Edit mode stays bigger so the buttons on each tile are easy to tap.
  const minScale = props.isEditing ? 0.75 : 0.6;
  const fit = size.height ? size.height / (2 * TILE_HEIGHT) : 1;
  const maxScale = Math.min(1, Math.max(minScale, fit));
  let scale = maxScale;
  if (size.width) {
    const columns = Math.ceil(size.width / tileWidth(maxScale));
    // 1 point spare, so rounding never pushes the last tile onto a new row.
    const filled = ((size.width - 1) / columns - TILE_MARGIN) / TILE_WIDTH;
    scale = filled >= minScale ? filled : maxScale;
  }

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize({ width, height });
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
