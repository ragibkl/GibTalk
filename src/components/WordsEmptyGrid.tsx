import { View, Text, StyleSheet } from "react-native";

export default function WordsEmptyGrid() {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }} />
      <Text>It looks like you don't have any words configured yet.</Text>
      <Text>You can start adding words to the app via the Edit mode.</Text>
      <Text></Text>
      <Text>
        If you have a backup of words saved previously, you can restore that via
        Edit - Restore feature.
      </Text>
      <Text></Text>
      <Text>
        Alternatively, you can also download a pre-configured word config set
        via Edit - Templates feature.
      </Text>
      <View style={{ flex: 1 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
});
