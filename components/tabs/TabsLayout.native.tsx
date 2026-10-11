import { NativeTabs, Icon, Label, VectorIcon } from "expo-router/unstable-native-tabs";
import React from "react";
import { Platform } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeColors } from "../../constants/ThemeColors";
import { useAppTheme } from "../../contexts/ThemeContext";

const TRACK_COLOR = "#D35400";

/** iOS / Android tab shell. */
export default function TabsLayout() {
  const theme = useAppTheme();
  const colors = ThemeColors[theme];
  const inactiveColor = colors.textMuted;
  const tabBackground = colors.background;
  const indicatorColor =
    theme === "dark" ? "rgba(211, 84, 0, 0.35)" : "rgba(211, 84, 0, 0.18)";

  return (
    <NativeTabs
      tintColor={TRACK_COLOR}
      backgroundColor={tabBackground}
      {...(Platform.OS === "android"
        ? {
            indicatorColor,
            rippleColor: "rgba(211, 84, 0, 0.2)",
          }
        : {})}
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
