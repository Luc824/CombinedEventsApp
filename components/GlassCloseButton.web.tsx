import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { scaleFont, scaleSpacing } from "../utils/uiScale";

type GlassCloseButtonProps = {
  onPress: () => void;
  textColor: string;
  surfaceColor: string;
  size?: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Web: skip expo-glass-effect / expo-symbols. */
export default function GlassCloseButton({
  onPress,
  textColor,
  surfaceColor,
  size = scaleSpacing(30),
  accessibilityLabel = "Close",
  style,
}: GlassCloseButtonProps) {
  const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };
  const circleStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={hitSlop}
      style={[styles.button, circleStyle, { backgroundColor: surfaceColor }, style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons name="close" size={scaleFont(size * 0.6)} color={textColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});
