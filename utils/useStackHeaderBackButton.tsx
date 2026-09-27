import { Ionicons } from "@expo/vector-icons";
import type { NativeStackHeaderLeftProps } from "@react-navigation/native-stack";
import { SymbolView } from "expo-symbols";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { scaleFont, scaleSpacing } from "./uiScale";

const BUTTON_SIZE = scaleSpacing(32);

type BackButtonColors = {
  tintColor: string;
  textColor: string;
  surfaceColor: string;
};

/**
 * iOS 26 + react-native-screens ≤4.16 can leave the native header back
 * control visible but dead after the first pop (swipe still works).
 * Drive back through JS. On iOS, avoid nesting GlassView — the system
 * header already draws the circular glass chrome.
 */
export function useStackHeaderBackButton(colors: BackButtonColors) {
  const router = useRouter();

  return useCallback(
    (props: NativeStackHeaderLeftProps) => {
      if (!props.canGoBack) {
        return null;
      }

      const onPress = () => {
        if (router.canGoBack()) {
          router.back();
          return;
        }
        router.replace("/");
      };

      // Prefer theme text color over headerTintColor so the chevron stays
      // default (not brand orange).
      const iconColor = colors.tintColor;
      const icon = (
        <SymbolView
          name="chevron.left"
          size={scaleFont(18)}
          weight="semibold"
          tintColor={iconColor}
          fallback={
            <Ionicons name="chevron-back" size={scaleFont(22)} color={iconColor} />
          }
        />
      );

      if (Platform.OS === "ios") {
        return (
          <Pressable
            onPress={onPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessibilityRole="button"
            accessibilityLabel="Back"
            style={styles.iosHitTarget}
          >
            {icon}
          </Pressable>
        );
      }

      return (
        <TouchableOpacity
          onPress={onPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel="Back"
          style={[
            styles.androidButton,
            {
              backgroundColor: colors.surfaceColor,
              borderColor: colors.textColor,
            },
          ]}
        >
          <Ionicons name="chevron-back" size={scaleFont(22)} color={iconColor} />
        </TouchableOpacity>
      );
    },
    [router, colors.tintColor, colors.textColor, colors.surfaceColor]
  );
}

const styles = StyleSheet.create({
  iosHitTarget: {
    minWidth: BUTTON_SIZE,
    minHeight: BUTTON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  androidButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
});
