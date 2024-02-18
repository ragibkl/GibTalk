import { StyleSheet, Text, View } from "react-native";

import { Word } from "../../service/words";
import { useWordPath } from "../../service/wordPath";

import PressableOpacity from "../../components/PressableOpacity";

export default function BreadCrumbs() {
  const { wordPath, popToTop, popToWord } = useWordPath();

  const renderWord = (word: Word) => {
    const onPress = () => {
      popToWord(word);
    };

    return (
      <>
        <Text style={styles.separator}>/</Text>
        <PressableOpacity onPress={onPress}>
          <Text style={styles.text}>{word.label}</Text>
        </PressableOpacity>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <PressableOpacity onPress={popToTop}>
        <Text style={styles.text}>Home</Text>
      </PressableOpacity>
      {wordPath.map(renderWord)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  separator: {
    marginHorizontal: 5,
  },
  text: {
    color: "blue",
  },
});
