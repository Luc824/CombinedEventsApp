import { Tabs } from "expo-router";
import React from "react";

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
        options={{ title: "Events", headerShown: false }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: "Rankings", headerShown: false }}
      />
      <Tabs.Screen
        name="more"
        options={{ title: "More", headerShown: false }}
      />
    </Tabs>
  );
}
