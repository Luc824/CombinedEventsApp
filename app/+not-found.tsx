import React from "react";
import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";
import { scaleSpacing } from "@/utils/uiScale";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ThemedView style={styles.container}>
        <ThemedText type="title">This screen does not exist.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="link">Go to home screen!</ThemedText>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: scaleSpacing(20),
  },
  link: {
    marginTop: scaleSpacing(15),
    paddingVertical: scaleSpacing(15),
  },
});
