import { StyleSheet, View, Text } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import PressableOpacity from "./PressableOpacity";

export default function IconButton({
  label,
  icon,
  style = {},
  onPress = () => {},
}) {
  return (
    <PressableOpacity onPress={onPress}>
      <View style={[style, styles.container]}>
        <FontAwesome name={icon} size={18} color="#25292e" />
        <Text style={styles.buttonLabel}>{label}</Text>
      </View>
    </PressableOpacity>
  );
}

export function MaterialIconButton({
  label,
  icon,
  style = {},
  onPress = () => {},
}) {
  return (
    <PressableOpacity onPress={onPress}>
      <View style={[style, styles.container]}>
        <MaterialIcons name={icon} size={18} color="#25292e" />
        <Text style={styles.buttonLabel}>{label}</Text>
      </View>
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    borderRadius: 30,
    borderColor: "black",
    borderWidth: 2,
    width: 60,
    height: 60,
    backgroundColor: "rgb(200,200,200)",
  },
  buttonLabel: {
    color: "black",
    fontSize: 10,
  },
});
