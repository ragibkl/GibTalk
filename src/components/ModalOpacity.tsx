import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from "react-native";

type Props = {
  children: ReactNode | ReactNode[];
  style?: StyleProp<ViewStyle>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function ModalOpacity(props: Props) {
  const onDismiss = () => {
    props.setVisible(false);
  };

  return (
    <Modal
      visible={props.visible}
      onDismiss={onDismiss}
      transparent
      supportedOrientations={["landscape", "portrait"]}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Pressable style={styles.pressable} onPress={onDismiss}>
          <Pressable style={props.style}>{props.children}</Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "stretch",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    flex: 1,
    justifyContent: "center",
  },
  pressable: {
    alignItems: "center",
    alignSelf: "stretch",
    flex: 1,
    justifyContent: "center",
  },
});
