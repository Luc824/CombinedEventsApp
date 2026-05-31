import { Tabs } from "expo-router";
import { NativeTabs, Icon, Label, VectorIcon } from "expo-router/unstable-native-tabs";
import React from "react";
import { DynamicColorIOS, Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeColors } from "../../constants/ThemeColors";
import { useTheme } from "../../contexts/ThemeContext";

const TRACK_COLOR = "#D35400";

function WebTabsLayout() {
  const { theme } = useTheme();
  const colors = ThemeColors[theme];

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: colors.background, borderTopColor: colors.border },
        tabBarActiveTintColor: TRACK_COLOR,
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

function NativeTabsLayout() {
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
  const inactiveColor =
    Platform.OS === "ios"
      ? DynamicColorIOS({ dark: "#aaaaaa", light: "#888888" })
      : colors.textMuted;

  return (
    <NativeTabs
      tintColor={TRACK_COLOR}
      iconColor={{
        default: inactiveColor,
        selected: TRACK_COLOR,
      }}
      labelStyle={{
        default: { color: inactiveColor },
        selected: { color: TRACK_COLOR },
      }}
      minimizeBehavior="onScrollDown"
    >
      <NativeTabs.Trigger name="index">
        <Icon
          sf={{ default: "trophy", selected: "trophy.fill" }}
          androidSrc={<VectorIcon family={Ionicons} name="trophy-outline" />}
        />
        <Label>Events</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="ranking">
        <Icon
          sf={{ default: "chart.bar", selected: "chart.bar.fill" }}
          androidSrc={<VectorIcon family={Ionicons} name="podium-outline" />}
        />
        <Label>Rankings</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="more">
        <Icon
          sf={{ default: "ellipsis.circle", selected: "ellipsis.circle.fill" }}
          androidSrc={<VectorIcon family={Ionicons} name="ellipsis-horizontal" />}
        />
        <Label>More</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

export default function TabLayout() {
  if (Platform.OS === "web") {
    return <WebTabsLayout />;
  }

  return <NativeTabsLayout />;
}
