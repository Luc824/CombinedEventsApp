import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: "#000", borderTopColor: "#000" },
        tabBarActiveTintColor: "#D35400", // orange accent
        tabBarInactiveTintColor: "#888",
        headerStyle: { backgroundColor: "#000" },
        headerTitleStyle: { color: "#fff" },
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
        name="explore"
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
