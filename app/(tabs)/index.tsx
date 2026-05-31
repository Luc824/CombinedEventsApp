import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeColors } from "../../constants/ThemeColors";
import {
  ScreenLayout,
  pillButtonStyle,
  sectionHeaderStyle,
  buttonElevation,
} from "../../constants/ui";
import { useTheme } from "../../contexts/ThemeContext";
import { scaleFont, scaleSpacing } from "../../utils/uiScale";

const EVENT_BUTTONS = {
  men: [
    { label: "Decathlon", route: "/decathlon" as const },
    { label: "Heptathlon", route: "/men-heptathlon" as const },
  ],
  women: [
    { label: "Heptathlon", route: "/women-heptathlon" as const },
    { label: "Pentathlon", route: "/women-pentathlon" as const },
  ],
};

export default function EventsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = ThemeColors[theme];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Combined Events{"\n"}Calculator
        </Text>

        <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>Men</Text>
        <View style={styles.buttonRow}>
          {EVENT_BUTTONS.men.map((item) => (
            <TouchableOpacity
              key={item.route}
              style={[
                styles.eventButton,
                pillButtonStyle,
                buttonElevation(),
                { backgroundColor: colors.buttonPrimary },
              ]}
              onPress={() => router.push(item.route)}
            >
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionHeader, { color: colors.textMuted }]}>Women</Text>
        <View style={styles.buttonRow}>
          {EVENT_BUTTONS.women.map((item) => (
            <TouchableOpacity
              key={item.route}
              style={[
                styles.eventButton,
                pillButtonStyle,
                buttonElevation(),
                { backgroundColor: colors.buttonPrimary },
              ]}
              onPress={() => router.push(item.route)}
            >
              <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    ...Platform.select({
      web: { alignItems: "center" },
    }),
  },
  scrollView: {
    flex: 1,
    ...Platform.select({
      web: { maxWidth: ScreenLayout.contentMaxWidth, width: "100%" },
    }),
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: ScreenLayout.horizontalPadding,
    paddingTop: ScreenLayout.topPadding,
    paddingBottom: scaleSpacing(32),
    ...Platform.select({
      web: { alignSelf: "center", width: "100%" },
    }),
  },
  title: {
    fontSize: scaleFont(28),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: ScreenLayout.sectionGap,
    lineHeight: scaleSpacing(34),
  },
  sectionHeader: {
    ...sectionHeaderStyle,
    alignSelf: "flex-start",
  },
  buttonRow: {
    flexDirection: "row",
    gap: ScreenLayout.buttonGap,
    marginBottom: scaleSpacing(8),
  },
  eventButton: {
    flex: 1,
  },
  buttonText: {
    fontSize: scaleFont(16),
    fontWeight: "600",
    textAlign: "center",
  },
});
