import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { ThemeColors } from "../../constants/ThemeColors";

export default function TabLayout() {
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
  
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
        tabBarActiveTintColor: "#D35400", // orange accent
        tabBarInactiveTintColor: colors.textMuted,
        headerStyle: { backgroundColor: colors.background },
        headerTitleStyle: { color: colors.text },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Events",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: "Rankings",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="podium-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: "More",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ellipsis-horizontal" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
