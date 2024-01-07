import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

import { RootStackParamList } from "../../../App";
import { ImageResult, getSearchSymbols } from "../../api/imageSearch";

const IMAGE_SIZE = 100;

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
    try {
      const results = await getSearchSymbols(searchTerm);
      setIsFetching(false);
      setImageResults(results || []);
    } catch (error) {
      setIsFetching(false);
      setImageResults([]);
    }
  };

  const onChangeSearchTerm = (text: string) => {
    setSearchTerm(text);
  };

  const renderSymbol = (symbol: ImageResult, i: number) => {
    const onPress = () => {
      onUpdateUri(symbol.url);
      navigation.goBack();
    };

    return (
      <Pressable key={i} style={styles.symbolContainer} onPress={onPress}>
        <View style={styles.symbolImageBox}>
          <Image source={{ uri: symbol.url }} style={styles.symbolImage} />
        </View>
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
          style={styles.searchButton}
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
  searchButton: {
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
  symbolImageBox: {
    backgroundColor: "white",
  },
  symbolImage: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
  },
});
