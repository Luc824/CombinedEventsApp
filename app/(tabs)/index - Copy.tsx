import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemeColors } from "../../constants/ThemeColors";
import {
  ScreenLayout,
  buttonElevation,
  pillButtonStyle,
} from "../../constants/ui";
import { useTheme } from "../../contexts/ThemeContext";
import { scaleFont, scaleSpacing } from "../../utils/uiScale";

const SECTIONS = [
  {
    title: "Men",
    items: [
      { label: "Decathlon", route: "/decathlon" as const },
      { label: "Heptathlon", route: "/men-heptathlon" as const },
    ],
  },
  {
    title: "Women",
    items: [
      { label: "Heptathlon", route: "/women-heptathlon" as const },
      { label: "Pentathlon", route: "/women-pentathlon" as const },
    ],
  },
];

export default function EventsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = ThemeColors[theme];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.contentBlock}>
        <Text style={[styles.title, { color: colors.text }]}>
          Combined Events{"\n"}Calculator
        </Text>

        <View style={styles.buttonsArea}>
          {SECTIONS.map((section, sectionIndex) => (
            <View
              key={section.title}
              style={[styles.section, sectionIndex > 0 && styles.sectionSpaced]}
            >
              <Text style={[styles.sectionHeader, { color: colors.text }]}>
                {section.title}
              </Text>
              <View style={styles.buttonRow}>
                {section.items.map((item) => (
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
            </View>
          ))}
        </View>
        </View>
      </View>
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
  container: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: scaleSpacing(52),
    paddingHorizontal: ScreenLayout.horizontalPadding,
    ...Platform.select({
      web: { maxWidth: ScreenLayout.contentMaxWidth, width: "100%" },
    }),
  },
  contentBlock: {
    width: "100%",
    alignItems: "center",
  },
  title: {
    fontSize: scaleFont(28),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: scaleSpacing(32),
    lineHeight: scaleSpacing(34),
  },
  buttonsArea: {
    alignItems: "center",
    width: "100%",
  },
  section: {
    width: "100%",
    maxWidth: scaleSpacing(340),
    alignItems: "center",
  },
  sectionSpaced: {
    marginTop: scaleSpacing(14),
  },
  sectionHeader: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    marginBottom: scaleSpacing(12),
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    gap: scaleSpacing(12),
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
