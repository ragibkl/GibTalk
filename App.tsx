import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useKeepAwake } from "expo-keep-awake";
import { StatusBar } from "expo-status-bar";

import { LogBox, StyleSheet } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppStateProvider } from "./src/appState";
import { LanguagesProvider } from "./src/service/languages";

import { Word } from "./src/service/words";

import CreateWordScreen from "./src/screens/editWord/CreateWordScreen";
import EditWordScreen from "./src/screens/editWord/EditWordScreen";
import MainScreen from "./src/screens/main/MainScreen";
import ImageSearchScreen from "./src/screens/imageSearch/ImageSearchScreen";
import KeyboardScreen from "./src/screens/keyboard/KeyboardScreen";
import TemplateSearchScreen from "./src/screens/templates/TemplateSearchScreen";

// https://reactnavigation.org/docs/troubleshooting/#i-get-the-warning-non-serializable-values-were-found-in-the-navigation-state
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

export type RootStackParamList = {
  Home: undefined;
  createWord: undefined;
  editWord: { word: Word };
  searchImage: { onUpdateUri: (uri: string) => void };
  searchTemplate: undefined;
  keyboard: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  useKeepAwake();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* backHandler: Android Back closes an open menu first. */}
      <MenuProvider backHandler>
        <AppStateProvider>
          <LanguagesProvider>
            <SafeAreaProvider>
              <NavigationContainer>
                <Stack.Navigator screenOptions={screenOptions}>
                  <Stack.Screen
                    name="Home"
                    component={MainScreen}
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="keyboard"
                    component={KeyboardScreen}
                    options={{ headerShown: false }}
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
                  <Stack.Screen
                    name="searchTemplate"
                    component={TemplateSearchScreen}
                    options={{ title: "Import a Template" }}
                  />
                </Stack.Navigator>
              </NavigationContainer>

              {/* Full screen: more room for words, especially on phones. */}
              <StatusBar hidden />
            </SafeAreaProvider>
          </LanguagesProvider>
        </AppStateProvider>
      </MenuProvider>
    </GestureHandlerRootView>
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
