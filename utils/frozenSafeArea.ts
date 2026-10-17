import { Platform, StatusBar } from "react-native";
import { initialWindowMetrics } from "react-native-safe-area-context";

/**
 * Insets captured once at module load. Use these for Events / More layout instead
 * of SafeAreaView / useSafeAreaInsets — NativeTabs updates live insets after
 * first paint and that reflows vertically-placed content.
 */
export const FROZEN_INSETS = {
  top:
    initialWindowMetrics?.insets.top ??
    (Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0),
  bottom: initialWindowMetrics?.insets.bottom ?? 0,
  left: initialWindowMetrics?.insets.left ?? 0,
  right: initialWindowMetrics?.insets.right ?? 0,
};
