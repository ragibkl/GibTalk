import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { speakWord } from '../service/speech';

import { Word } from '../types';

type Props = {
  word: Word,
}

export default function HistoryItem({ word }: Props) {
  const onPress = () => {
    speakWord(word);
  }

  const { label, uri } = word;

  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri }} />
        <Text style={styles.text}>{label}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'green',
    borderColor: 'white',
    borderRadius: 5,
    borderWidth: 1,
    margin: 2,
    width: 60,
  },
  image: {
    marginTop: 2,
    width: 40,
    height: 40,
  },
  text: {
    margin: 2,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  }
});
