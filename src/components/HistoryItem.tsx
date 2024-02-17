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
    backgroundColor: "white",
    borderColor: "lightgreen",
    borderRadius: 5,
    borderWidth: 2,
    margin: 2,
    width: 65,
  },
  image: {
    backgroundColor: "white",
    borderColor: 'black',
    borderWidth: 1,
    height: 45,
    width: 45,
  },
  text: {
    margin: 2,
    fontWeight: "bold",
    fontSize: 10,
  },
});
