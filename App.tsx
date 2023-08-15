import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaView, StyleSheet } from "react-native";

import CreateWordScreen from "./src/screens/editWord/CreateWordScreen";
import EditWordScreen from "./src/screens/editWord/EditWordScreen";
import MainScreen from "./src/screens/main/MainScreen";
import { speakInit } from "./src/service/speech";
import { HistoryProvider } from "./src/service/history";
import { WordPathProvider } from "./src/service/wordPath";
import { WordsProvider } from "./src/service/words/WordsContext";

import { Word } from "./src/service/words";
import ImageSearchScreen from "./src/screens/imageSearch/ImageSearchScreen";

export type RootStackParamList = {
  Home: undefined;
  createWord: undefined;
  editWord: { word: Word };
  searchImage: { onUpdateUri: (uri: string) => void };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  useEffect(() => {
    speakInit();
  }, []);

  return (
    <WordPathProvider>
      <HistoryProvider>
        <WordsProvider>
          <SafeAreaView style={styles.container}>
            <NavigationContainer>
              <Stack.Navigator screenOptions={screenOptions}>
                <Stack.Screen
                  name="Home"
                  component={MainScreen}
                  options={{ title: "GibTalk - Development" }}
                />
                <Stack.Screen
                  name="createWord"
                  component={CreateWordScreen}
                  options={{ title: "Add New Word" }}
                />
                <Stack.Screen
                  name="editWord"
                  component={EditWordScreen}
                  options={{ title: "Edit Word" }}
                />
                <Stack.Screen
                  name="searchImage"
                  component={ImageSearchScreen}
                  options={{ title: "Search Symbol" }}
                />
              </Stack.Navigator>
            </NavigationContainer>

            <StatusBar style="auto" />
          </SafeAreaView>
        </WordsProvider>
      </HistoryProvider>
    </WordPathProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "stretch",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "flex-start",
  },
  header: {
    height: 60,
  },
  headerTitle: {
    fontSize: 16,
    bottom: 5,
  },
  headerBackTitle: {
    marginBottom: 15,
  },
});

const screenOptions = {
  headerStyle: styles.header,
  headerTitleStyle: styles.headerTitle,
  headerBackTitleStyle: styles.headerBackTitle,
};
