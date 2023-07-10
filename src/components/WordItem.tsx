import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { speakWord } from '../service/speech';
import { Word } from '../types';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  word: Word,
  isEditing: boolean,
  onPress?: () => void,
  onPressRemove: () => void,
  onLongPress?: () => void,
}

export default function WordItem({ word, onPress, onLongPress, isEditing, onPressRemove }: Props) {
  const handleOnPress = () => {
    speakWord(word);

    if (!isEditing) {
      onPress();
    }
  }

  const { uri, label } = word;
  return (
    <Pressable onPress={handleOnPress} onLongPress={onLongPress}>
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri }} />
        <Text style={styles.text}>{label}</Text>
      </View>
      {isEditing && (
        <View style={styles.deleteContainer}>
          <Pressable onPress={onPressRemove}>
            <MaterialIcons style={styles.deleteIcon} size={30} name="remove-circle" color="red" />
          </Pressable>
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'green',
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    margin: 5,
    width: 120,
  },
  image: {
    marginTop: 15,
    width: 80,
    height: 80,
  },
  text: {
    margin: 5,
    color: 'white',
    fontWeight: 'bold',
  },
  deleteContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  deleteIcon: {
    borderColor: 'white',
    borderWidth: 2,
    borderRadius: 15,
    backgroundColor: 'white',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'

  },
});
