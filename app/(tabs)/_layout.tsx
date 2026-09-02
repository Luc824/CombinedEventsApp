import { Tabs } from "expo-router";
import { NativeTabs, Icon, Label, VectorIcon } from "expo-router/unstable-native-tabs";
import React from "react";
import { DynamicColorIOS, Platform, useColorScheme, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import WebNavBar from "../../components/WebNavBar";
import { ThemeColors } from "../../constants/ThemeColors";
import { useTheme } from "../../contexts/ThemeContext";

const TRACK_COLOR = "#D35400";

function WebTabsLayout() {
  const { theme } = useTheme();
  const colors = ThemeColors[theme];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <WebNavBar />
      <View style={{ flex: 1 }}>
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
    </View>
  );
}

function NativeTabsLayout() {
  // NativeTabs renders outside ThemeProvider — use system scheme for tab colors.
  const colorScheme = useColorScheme();
  const colors = ThemeColors[colorScheme === "light" ? "light" : "dark"];
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
