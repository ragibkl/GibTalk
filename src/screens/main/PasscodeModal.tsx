import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput } from "react-native";

import ModalOpacity from "../../components/ModalOpacity";

type Props = {
  onOk: () => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function PasscodeModal(props: Props) {
  const [input, setInput] = useState("");

  const answer = useMemo(() => {
    // Returns a random integer from 0 to 9:
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    const c = Math.floor(Math.random() * 10);
    const d = Math.floor(Math.random() * 10);

    return `${a}${b}${c}${d}`;
  }, [props.visible]);

  const onPressOk = () => {
    if (input.trim() === answer) {
      setInput("");
      props.setVisible(false);
      props.onOk();
    }
  };

  return (
    <ModalOpacity
      style={styles.container}
      visible={props.visible}
      setVisible={props.setVisible}
    >
      <Text style={styles.text}>Please input {answer} to continue</Text>
      <TextInput
        style={styles.textInput}
        value={input}
        onChangeText={setInput}
        keyboardType="numeric"
      />

      <Pressable style={styles.button} onPress={onPressOk}>
        <Text>Ok</Text>
      </Pressable>
    </ModalOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 10,
  },
  text: {
    fontSize: 16,
  },
  textInput: {
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 2,
    height: 40,
    marginTop: 10,
    padding: 5,
    width: 230,
  },
  button: {
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "lightgreen",
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 2,
    height: 40,
    marginTop: 10,
    padding: 5,
    width: 90,
  },
});
