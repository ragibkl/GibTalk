import "react-native-gesture-handler";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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
import KeyboardScreen from "./src/screens/keyboard/KeyboardScreen";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";

export type RootStackParamList = {
  Home: undefined;
  createWord: undefined;
  editWord: { word: Word };
  searchImage: { onUpdateUri: (uri: string) => void };
};

const Stack = createStackNavigator<RootStackParamList>();

export type HomeTabsParamList = {
  TabHome: undefined;
  TabKeyboard: undefined;
};
const Tab = createBottomTabNavigator<HomeTabsParamList>();

function HomeTabs() {
  const screenOptions = {
    headerShown: false,
  };

  const homeTabOptions = {
    title: "Home",
    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
      <MaterialCommunityIcons name="home" color={color} size={size} />
    ),
  };

  const keyboardTabOptions = {
    title: "Keyboard",
    tabBarIcon: ({ color, size }: { color: string; size: number }) => (
      <MaterialCommunityIcons name="keyboard" color={color} size={size} />
    ),
  };

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="TabHome"
        component={MainScreen}
        options={homeTabOptions}
      />
      <Tab.Screen
        name="TabKeyboard"
        component={KeyboardScreen}
        options={keyboardTabOptions}
      />
    </Tab.Navigator>
  );
}

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
                {/* <Tab.Navigator>
                  <Tab.Screen name="Home" component={MainScreen} options={{ title: "Home" }} />
                  <Tab.Screen name="Keyboard" component={KeyboardScreen} options={{ title: "Keyboard" }} />
                </Tab.Navigator> */}
                <Stack.Screen
                  name="Home"
                  component={HomeTabs}
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
