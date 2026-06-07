import { Ionicons } from "@expo/vector-icons";
import { GlassView, isGlassEffectAPIAvailable } from "expo-glass-effect";
import { SymbolView } from "expo-symbols";
import React from "react";
import {
  Platform,
  Pressable,
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

export default function GlassCloseButton({
  onPress,
  textColor,
  surfaceColor,
  size = scaleSpacing(30),
  accessibilityLabel = "Close",
  style,
}: GlassCloseButtonProps) {
  const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };
  const useGlassClose = Platform.OS === "ios" && isGlassEffectAPIAvailable();
  const circleStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (useGlassClose) {
    return (
      <Pressable
        onPress={onPress}
        hitSlop={hitSlop}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={style}
      >
        <GlassView isInteractive style={[styles.button, circleStyle]}>
          <SymbolView
            name="xmark"
            size={scaleFont(size * 0.43)}
            weight="semibold"
            tintColor={textColor}
            fallback={<Ionicons name="close" size={size * 0.6} color={textColor} />}
          />
        </GlassView>
      </Pressable>
    );
  }

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
