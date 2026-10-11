import { Tabs } from "expo-router";
import React from "react";
import { View } from "react-native";
import { ThemeColors } from "../../constants/ThemeColors";
import { useTheme } from "../../contexts/ThemeContext";

/** Default / web tab shell (no NativeTabs). */
export default function TabsLayout() {
  const { theme } = useTheme();
  const colors = ThemeColors[theme];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        tabBar={() => null}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: colors.background },
        }}
      >
        <Tabs.Screen name="index" options={{ title: "Events" }} />
        <Tabs.Screen name="ranking" options={{ title: "Rankings" }} />
        <Tabs.Screen name="more" options={{ title: "More" }} />
      </Tabs>
    </View>
  );
}
