import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, View, Text, StyleProp, ViewStyle } from "react-native";

import PressableOpacity from "./PressableOpacity";

type IconButtonProps = {
  label: string;
  icon: keyof typeof FontAwesome.glyphMap;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  // A red dot: something needs a parent's attention.
  alert?: boolean;
};

export default function IconButton({
  label,
  icon,
  style = {},
  onPress = () => {},
  alert = false,
}: IconButtonProps) {
  return (
    <PressableOpacity onPress={onPress} testID={`button-${label}`}>
      <View style={[style, styles.container]}>
        <FontAwesome name={icon} size={18} color="#25292e" />
        <Text style={styles.buttonLabel}>{label}</Text>
        {alert && <View style={styles.alertDot} />}
      </View>
    </PressableOpacity>
  );
}

type MaterialIconButtonProps = {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
};

export function MaterialIconButton({
  label,
  icon,
  style = {},
  onPress = () => {},
}: MaterialIconButtonProps) {
  return (
    <PressableOpacity onPress={onPress} testID={`button-${label}`}>
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
    backgroundColor: "white",
  },
  buttonLabel: {
    color: "black",
    fontSize: 10,
  },
  alertDot: {
    position: "absolute",
    top: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#d32f2f",
    borderColor: "white",
    borderWidth: 2,
  },
});
