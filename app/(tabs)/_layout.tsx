import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="keyboard"
        options={{
          title: "Keyboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="keyboard" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
