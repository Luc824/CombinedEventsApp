import { Stack } from "expo-router";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeColors } from "../constants/ThemeColors";
import { USE_NATIVE_HEADER } from "../constants/navigation";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import "../utils/purchases";
const TRACK_COLOR = "#D35400";

function AppStack() {
  const { theme } = useTheme();
  const colors = ThemeColors[theme];

  return (
    <Stack
      screenOptions={{
        headerShown: USE_NATIVE_HEADER,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: TRACK_COLOR,
        headerTitleStyle: { color: colors.text, fontWeight: "600" },
        headerShadowVisible: false,
        headerBackTitle: "",
        headerBackButtonDisplayMode: "minimal",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false, title: "Events" }}
      />
      <Stack.Screen
        name="decathlon"
        options={{
          title: "Men's Decathlon",
        }}
      />
      <Stack.Screen
        name="men-heptathlon"
        options={{
          title: "Men's Heptathlon",
        }}
      />
      <Stack.Screen
        name="women-heptathlon"
        options={{
          title: "Women's Heptathlon",
        }}
      />
      <Stack.Screen
        name="women-pentathlon"
        options={{
          title: "Women's Pentathlon",
        }}
      />
      <Stack.Screen
        name="saved-scores"
        options={{
          title: "Saved Scores",
          headerLargeTitle: false,
        }}
      />
      <Stack.Screen
        name="saved-score-detail"
        options={{
          title: "Saved Score",
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (    <SafeAreaProvider>
      <ThemeProvider>
        <AppStack />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
