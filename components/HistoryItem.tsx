import * as Speech from 'expo-speech';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';

export default function HistoryItem({ label, uri }) {
  const onPress = () => {
    Speech.speak(label);
  }

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
