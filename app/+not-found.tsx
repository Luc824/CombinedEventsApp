import React from "react";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { scaleSpacing } from "@/utils/uiScale";
import { ThemeColors } from "../constants/ThemeColors";
import { useTheme } from "../contexts/ThemeContext";

export default function NotFoundScreen() {
  const { theme } = useTheme();
  const colors = ThemeColors[theme];

  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          This screen does not exist.
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={[styles.linkText, { color: TRACK_COLOR }]}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const TRACK_COLOR = "#D35400";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: scaleSpacing(20),
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  link: {
    marginTop: scaleSpacing(15),
    paddingVertical: scaleSpacing(15),
  },
  linkText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
