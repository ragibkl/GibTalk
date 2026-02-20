import "react-native-gesture-handler";

import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import { Stack } from "expo-router";
import { useKeepAwake } from "expo-keep-awake";
import { StatusBar } from "expo-status-bar";

import { MenuProvider } from "react-native-popup-menu";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppStateProvider } from "../src/appState";
import { ImagePickerProvider } from "../src/context/imagePicker";

export default function RootLayout() {
  useKeepAwake();

  return (
    <MenuProvider>
      <AppStateProvider>
        <SafeAreaProvider>
          <ImagePickerProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="createWord"
                options={{ title: "Add New Word" }}
              />
              <Stack.Screen name="editWord" options={{ title: "Edit Word" }} />
              <Stack.Screen
                name="searchImage"
                options={{ title: "Search Symbol" }}
              />
              <Stack.Screen
                name="searchTemplate"
                options={{ title: "Import a Template" }}
              />
            </Stack>
            <StatusBar style="auto" />
          </ImagePickerProvider>
        </SafeAreaProvider>
      </AppStateProvider>
    </MenuProvider>
  );
}

