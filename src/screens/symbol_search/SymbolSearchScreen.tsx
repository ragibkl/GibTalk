import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import ImageLoad from "react-native-image-placeholder";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";

import { RootStackParamList } from "../../../App";

const placeholderImage = require("../../../assets/placeholder.png");

type SymbolSearchNavigationProps = NavigationProp<
  RootStackParamList,
  "searchSymbol"
>;
type SymbolSearchScreenProps = StackScreenProps<
  RootStackParamList,
  "searchSymbol"
>;

type Symbol = {
  uri: string;
  terms: string;
};

export default function SymbolSearchScreen(props: SymbolSearchScreenProps) {
  const onUpdateUri = props.route.params.onUpdateUri;
  const navigation = useNavigation<SymbolSearchNavigationProps>();

  const [searchTerm, setSearchTerm] = useState("");
  const [symbols, setSymbols] = useState<Symbol[]>([]);

  const searchSymbol = async (text: string) => {
    const keywords = text.trim();
    if (!keywords) {
      return;
    }

    const body = new URLSearchParams({
      keywords,
      aramode: "1",
      tawmode: "1",
      mulmode: "1",
    }).toString();

    const res = await fetch("https://www.senteacher.org/getsymbols/", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
      body,
    });
    const data = await res.json();

    const result: Symbol[] = [];
    for (let i = 0; i < data.resultcount; i++) {
      const uri = `https://www.senteacher.org/${data.results[i]}`;
      const terms = data.resultwords[i];
      result.push({ uri, terms });
    }

    // console.log(symbols);
    setSymbols(result);
  };

  const searchSymbolDebounced = useDebouncedCallback(searchSymbol, 500);

  const onChangeText = (text: string) => {
    setSearchTerm(text);
    searchSymbolDebounced(text.trim());
  };

  const onPressSymbol = (symbol: Symbol) => {
    onUpdateUri(symbol.uri);
    navigation.goBack();
  };

  const renderSymbol = (symbol: Symbol, i: number) => {
    const source = { uri: symbol.uri };
    return (
      <Pressable
        key={i}
        style={styles.symbolContainer}
        onPress={() => onPressSymbol(symbol)}
      >
        <ImageLoad
          style={styles.symbolImage}
          source={source}
          loadingStyle={{ size: "large", color: "blue" }}
          borderRadius={5}
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
          onChangeText={onChangeText}
          value={searchTerm}
        />
      </View>

      <ScrollView contentContainerStyle={styles.symbolGrid}>
        {symbols.map(renderSymbol)}
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
    marginBottom: 5,
  },
  inputTitle: {
    width: 100,
  },
  textInput: {
    height: 40,
    width: 230,
    padding: 5,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
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
