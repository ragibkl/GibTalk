import { StyleSheet, Text, View, Image } from 'react-native';
import { speakWord } from '../service/speech';
import { Word } from '../types';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import PressableOpacity from './PressableOpacity';
import { useWords } from '../service/words';

type Props = {
  word: Word,
  isEditing: boolean,
  onPress?: () => void,
  onPressEdit?: () => void,
  onLongPress?: () => void,
}

export default function WordItem({ word, onPress, onPressEdit, onLongPress, isEditing }: Props) {
  const { removeWord, moveWordLeft, moveWordRight } = useWords();

  const handleOnPress = () => {
    speakWord(word);

    if (!isEditing) {
      onPress();
    }
  }

  const { uri, label } = word;
  return (
    <PressableOpacity onPress={handleOnPress} onLongPress={onLongPress}>
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri }} />
        <Text style={styles.text}>{label}</Text>
      </View>
      {isEditing && (
        <>
          <View style={styles.editContainer}>
            <PressableOpacity onPress={onPressEdit}>
              <FontAwesome style={styles.editIcon} size={30} name="edit" color="black" />
            </PressableOpacity>
          </View>

          <View style={styles.deleteContainer}>
            <PressableOpacity onPress={() => removeWord(word.id)}>
              <MaterialIcons style={styles.deleteIcon} size={30} name="remove-circle" color="red" />
            </PressableOpacity>
          </View>

          <View style={styles.leftContainer}>
            <PressableOpacity onPress={() => moveWordLeft(word.id)}>
              <MaterialIcons style={styles.moveIcon} size={25} name="arrow-left" color="black" />
            </PressableOpacity>
          </View>

          <View style={styles.rightContainer}>
            <PressableOpacity onPress={() => moveWordRight(word.id)}>
              <MaterialIcons style={styles.moveIcon} size={25} name="arrow-right" color="black" />
            </PressableOpacity>
          </View>
        </>
      )}
    </PressableOpacity>
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
  editContainer: {
    position: 'absolute',
    top: 0,
    left: 20,
  },
  editIcon: {
    // borderColor: 'white',
    // borderWidth: 2,
    // borderRadius: 15,
    // backgroundColor: 'white',
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteContainer: {
    position: 'absolute',
    top: 0,
    right: 20,
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
  leftContainer: {
    position: 'absolute',
    top: '40%',
    left: 10,
  },
  rightContainer: {
    position: 'absolute',
    top: '40%',
    right: 10,
  },
  moveIcon: {
    borderColor: 'black',
    borderWidth: 2,
    backgroundColor: 'white',
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
