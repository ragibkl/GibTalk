import { StyleSheet, View } from "react-native";
import * as Progress from "react-native-progress";

export function ProgressIcon() {
  return (
    <View style={styles.container}>
      <Progress.Circle size={100} indeterminate />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
