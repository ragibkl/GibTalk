import { useState } from "react";
import {
  ActivityIndicator,
  LogBox,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Image from "react-native-image-progress";
import * as Progress from "react-native-progress";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

import { RootStackParamList } from "../../../App";
import { ImageResult, postSearchSymbols } from "../../service/imageSearch";
import FontAwesome from "@expo/vector-icons/FontAwesome";

// https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

type ImageSearchNavigationProps = NavigationProp<
  RootStackParamList,
  "searchImage"
>;
type ImageSearchScreenProps = StackScreenProps<
  RootStackParamList,
  "searchImage"
>;

export default function ImageSearchScreen(props: ImageSearchScreenProps) {
  const onUpdateUri = props.route.params.onUpdateUri;
  const navigation = useNavigation<ImageSearchNavigationProps>();

  const [searchTerm, setSearchTerm] = useState("");
  const [imageResults, setImageResults] = useState<ImageResult[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const onPressSearch = async () => {
    setIsFetching(true);
    const results = await postSearchSymbols(searchTerm);
    setIsFetching(false);
    setImageResults(results || []);
  };

  const onChangeSearchTerm = (text: string) => {
    setSearchTerm(text);
  };

  const onPressSymbol = (symbol: ImageResult) => {
    onUpdateUri(symbol.uri);
    navigation.goBack();
  };

  const renderSymbol = (symbol: ImageResult, i: number) => {
    const source = { uri: symbol.uri };
    return (
      <Pressable
        key={i}
        style={styles.symbolContainer}
        onPress={() => onPressSymbol(symbol)}
      >
        <Image
          source={source}
          indicator={Progress.Circle}
          style={styles.symbolImage}
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowInput}>
        <Text style={styles.inputTitle}>Search</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={onChangeSearchTerm}
          value={searchTerm}
        />
        <Pressable
          style={styles.imageButton}
          onPress={onPressSearch}
          disabled={isFetching}
        >
          {isFetching ? (
            <ActivityIndicator size="small" />
          ) : (
            <FontAwesome name="search" size={20} />
          )}
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.symbolGrid}>
        {imageResults.map(renderSymbol)}
      </ScrollView>
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
  rowInput: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 15,
    marginBottom: 5,
  },
  inputTitle: {
    width: 100,
  },
  textInput: {
    height: 40,
    width: 300,
    padding: 5,
    paddingLeft: 15,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
  },
  imageButton: {
    height: 40,
    width: 40,
    padding: 5,
    marginLeft: 10,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  symbolGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  symbolContainer: {
    borderColor: "black",
    borderRadius: 5,
    borderWidth: 2,
    marginLeft: 15,
    marginTop: 15,
  },
  symbolImage: {
    height: 100,
    width: 100,
  },
});
