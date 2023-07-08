import * as Speech from 'expo-speech';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';

export default function WordItem({ label, uri, onPress }) {
  const handleOnPress = () => {
    Speech.speak(label);
    onPress();
  }

  return (
    <Pressable onPress={handleOnPress}>
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri }}  />
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
  }
});
