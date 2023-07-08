import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function IconButton({ label, icon, style = {}, onPress = () => {} }) {
  return (
    <Pressable onPress={onPress}>
      <View style={[style, styles.container]}>
        <FontAwesome name={icon} size={18} color="#25292e"/>
        <Text style={styles.buttonLabel}>{label}</Text>
      </View>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    borderRadius: 30,
    borderColor: 'black',
    borderWidth: 2,
    width: 60,
    height: 60,
    backgroundColor: 'rgb(200,200,200)',
  },
  buttonLabel: {
    color: 'black',
    fontSize: 10,
  },
});
