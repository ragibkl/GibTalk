// The dashed "+ Add word" / "+ Add folder" tiles at the end of the board in
// edit mode, sized like word tiles (same as app.gibtalk.com).
import { StyleSheet, Text, View } from "react-native";

import PressableOpacity from "./PressableOpacity";
import { TILE_WIDTH } from "./WordItem";

type Props = {
  folder: boolean;
  scale: number;
  onPress: () => void;
};

export default function AddTile({ folder, scale, onPress }: Props) {
  const box = Math.round(100 * scale);
  return (
    <PressableOpacity
      onPress={onPress}
      testID={folder ? "add-folder-tile" : "add-word-tile"}
    >
      <View
        style={[
          styles.container,
          folder && styles.folder,
          { width: Math.floor(TILE_WIDTH * scale) },
        ]}
      >
        <View
          style={[
            styles.plusBox,
            { width: box, height: box, marginTop: Math.round(15 * scale) },
          ]}
        >
          <Text style={[styles.plus, { fontSize: Math.round(48 * scale) }]}>
            +
          </Text>
        </View>
        <Text
          style={[
            styles.label,
            { fontSize: Math.max(12, Math.round(14 * scale)) },
          ]}
        >
          {folder ? "Add folder" : "Add word"}
        </Text>
      </View>
    </PressableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#f6fff6",
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: "dashed",
    margin: 5,
  },
  folder: {
    backgroundColor: "#fffde0",
  },
  plusBox: {
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#444",
    borderRadius: 5,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  plus: {
    color: "#444",
  },
  label: {
    margin: 5,
    fontWeight: "bold",
    textAlign: "center",
  },
});
