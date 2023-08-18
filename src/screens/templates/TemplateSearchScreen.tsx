import { StackScreenProps } from "@react-navigation/stack";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { RootStackParamList } from "../../../App";

import IconButton from "../../components/IconButton";

type TemplatesScreenProps = StackScreenProps<RootStackParamList, "searchTemplate">;

export default function TemplateSearchScreen(props: TemplatesScreenProps) {
  const [templates, setTemplates] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  return (
    <View style={styles.container}>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignSelf: "stretch",
    padding: 10,
  },
});
