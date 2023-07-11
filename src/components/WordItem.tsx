import { StyleSheet, Text, View, Image } from 'react-native';
import { speakWord } from '../service/speech';
import { Word } from '../types';
import { MaterialIcons } from '@expo/vector-icons';
import PressableOpacity from './PressableOpacity';

type Props = {
  word: Word,
  isEditing: boolean,
  onPress?: () => void,
  onPressRemove?: () => void,
  onLongPress?: () => void,
  onPressLeft?: () => void,
  onPressRight?: () => void,
}

export default function WordItem({ word, onPress, onLongPress, isEditing, onPressRemove, onPressLeft, onPressRight }: Props) {
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
          <View style={styles.deleteContainer}>
            <PressableOpacity onPress={onPressRemove}>
              <MaterialIcons style={styles.deleteIcon} size={30} name="remove-circle" color="red" />
            </PressableOpacity>
          </View>

          <View style={styles.leftContainer}>
            <PressableOpacity onPress={onPressLeft}>
              <MaterialIcons style={styles.moveIcon} size={25} name="arrow-left" color="black" />
            </PressableOpacity>
          </View>

          <View style={styles.rightContainer}>
            <PressableOpacity onPress={onPressRight}>
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
