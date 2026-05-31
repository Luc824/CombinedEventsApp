import { Platform, TextStyle, ViewStyle } from "react-native";
import { scaleFont, scaleSpacing } from "../utils/uiScale";

export const TRACK_COLOR = "#D35400";

/** Shared corner radii — pill shape preserved for primary navigation buttons */
export const Radius = {
  sm: scaleSpacing(8),
  md: scaleSpacing(12),
  lg: scaleSpacing(16),
  pill: scaleSpacing(30),
} as const;

export const ScreenLayout = {
  horizontalPadding: scaleSpacing(20),
  contentMaxWidth: 700,
  topPadding: scaleSpacing(24),
  sectionGap: scaleSpacing(24),
  buttonGap: scaleSpacing(12),
} as const;

/** iOS-style section header (Men, Women, etc.) */
export const sectionHeaderStyle: TextStyle = {
  fontSize: scaleFont(13),
  fontWeight: "600",
  textTransform: "uppercase",
  letterSpacing: 0.6,
  marginBottom: scaleSpacing(8),
  marginTop: scaleSpacing(16),
};

/** Track-shaped pill button for event selection and menu actions */
export const pillButtonStyle: ViewStyle = {
  borderRadius: Radius.pill,
  paddingVertical: scaleSpacing(14),
  paddingHorizontal: scaleSpacing(20),
  alignItems: "center",
  justifyContent: "center",
};

/** Bordered pill for settings-style actions on More screen */
export const surfacePillButtonStyle: ViewStyle = {
  ...pillButtonStyle,
  borderWidth: 1,
};

/** Moderate-radius action button for in-screen workflows (calculators, rankings) */
export const actionButtonStyle: ViewStyle = {
  borderRadius: Radius.md,
  paddingVertical: scaleSpacing(12),
  paddingHorizontal: scaleSpacing(20),
  alignItems: "center",
  justifyContent: "center",
};

/** Flat on iOS; subtle elevation on Android only */
export function buttonElevation(): ViewStyle {
  return (
    Platform.select({
      ios: {},
      android: { elevation: 2 },
      default: {},
    }) ?? {}
  );
}
