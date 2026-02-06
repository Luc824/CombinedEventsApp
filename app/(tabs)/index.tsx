import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Alert,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";
import { ThemeColors } from "../../constants/ThemeColors";
import { scaleFont, scaleSpacing } from "../../utils/uiScale";

const TRACK_COLOR = "#D35400";

export default function EventsScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = ThemeColors[theme];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>Combined Events{"\n"}Calculator</Text>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Men</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.pillButton, { backgroundColor: colors.buttonPrimary }]}
            onPress={() => router.push("/decathlon")}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Decathlon</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.pillButton, { backgroundColor: colors.buttonPrimary }]}
            onPress={() => router.push("/men-heptathlon")}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Heptathlon</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Women</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.pillButton, { backgroundColor: colors.buttonPrimary }]}
            onPress={() => router.push("/women-heptathlon")}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Heptathlon</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.pillButton, { backgroundColor: colors.buttonPrimary }]}
            onPress={() => router.push("/women-pentathlon")}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>Pentathlon</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    ...Platform.select({
      web: {
        alignItems: "center",
      },
    }),
  },
  container: {
    flex: 1,
    padding: scaleSpacing(20),
    justifyContent: "flex-start",
    paddingTop: scaleSpacing(160),
    ...Platform.select({
      web: {
        maxWidth: 700,
        alignSelf: "center",
        width: "100%",
      },
    }),
  },
  title: {
    fontSize: scaleFont(28),
    fontWeight: "bold",
    textAlign: "center",
    marginTop: scaleSpacing(20),
    marginBottom: scaleSpacing(30),
    lineHeight: scaleSpacing(34),
  },
  sectionTitle: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: scaleSpacing(10),
    marginTop: scaleSpacing(10),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: scaleSpacing(20),
    gap: scaleSpacing(20),
  },
  button: {
    borderColor: "#fff",
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },
  pillButton: {
    borderRadius: scaleSpacing(30),
    paddingVertical: scaleSpacing(14),
    paddingHorizontal: scaleSpacing(30),
    flex: 1,
  },
  buttonText: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    textAlign: "center",
  },
});
