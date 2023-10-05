import { StyleSheet, Text, View, Image } from "react-native";

import { speakWord } from "../service/speech";
import { Word } from "../service/words";

import PressableOpacity from "./PressableOpacity";

type Props = {
  word: Word;
};

export default function HistoryItem({ word }: Props) {
  const onPress = () => {
    speakWord(word);
  };

  const { label, uri } = word;

  return (
    <PressableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri }} />
        <Text style={styles.text}>{label}</Text>
      </View>
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "lightgreen",
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 1,
    margin: 2,
    width: 60,
  },
  image: {
    backgroundColor: "white",
    borderColor: "black",
    borderRadius: 3,
    borderWidth: 1,
    height: 40,
    marginTop: 2,
    width: 40,
  },
  text: {
    margin: 2,
    fontWeight: "bold",
    fontSize: 10,
  },
});
