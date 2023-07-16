import { ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  ViewStyle,
  PressableStateCallbackType,
  GestureResponderEvent,
  StyleSheet,
} from "react-native";

type Props = {
  children: ReactNode | ReactNode[];
  style?: StyleProp<ViewStyle>;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
};

export default function PressableOpacity({
  children,
  style,
  onPress,
  onLongPress,
}: Props) {
  const styleCallback = (state: PressableStateCallbackType) => {
    return [state.pressed ? styles.isPressed : styles.default, style];
  };

  return (
    <Pressable
      style={styleCallback}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  isPressed: {
    opacity: 0.5,
  },
  default: {
    opacity: 1,
  },
});
