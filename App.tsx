import "react-native-gesture-handler";

import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useKeepAwake } from "expo-keep-awake";
import { StatusBar } from "expo-status-bar";

import { LogBox, StyleSheet } from "react-native";
import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppStateProvider } from "./src/appState";

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
  useKeepAwake();

  return (
    <MenuProvider>
      <AppStateProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={screenOptions}>
              <Stack.Screen
                name="Home"
                component={HomeTabs}
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

          <StatusBar style="auto" />
        </SafeAreaProvider>
      </AppStateProvider>
    </MenuProvider>
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
