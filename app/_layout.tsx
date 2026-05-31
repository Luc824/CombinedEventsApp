import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import { ThemeColors } from "../constants/ThemeColors";
import { USE_NATIVE_HEADER } from "../constants/navigation";
// Temporarily disabled for Expo Go testing
// import Purchases from "react-native-purchases";

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
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="decathlon"
        options={{
          title: "Men's Decathlon",
          headerBackTitle: "Events",
        }}
      />
      <Stack.Screen
        name="men-heptathlon"
        options={{
          title: "Men's Heptathlon",
          headerBackTitle: "Events",
        }}
      />
      <Stack.Screen
        name="women-heptathlon"
        options={{
          title: "Women's Heptathlon",
          headerBackTitle: "Events",
        }}
      />
      <Stack.Screen
        name="women-pentathlon"
        options={{
          title: "Women's Pentathlon",
          headerBackTitle: "Events",
        }}
      />
      <Stack.Screen
        name="saved-scores"
        options={{
          title: "Saved Scores",
          headerBackTitle: "More",
          headerLargeTitle: true,
        }}
      />
      <Stack.Screen
        name="saved-score-detail"
        options={{
          title: "Saved Score",
          headerBackTitle: "Saved Scores",
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    // Temporarily disabled for Expo Go testing
    // RevenueCat requires native modules and doesn't work in Expo Go
    /*
    const apiKey =
      Platform.select({
        ios: Constants.expoConfig?.extra?.revenueCatApiKeyIos,
        android: Constants.expoConfig?.extra?.revenueCatApiKeyAndroid,
        default: undefined,
      }) || undefined;
    if (apiKey) {
      Purchases.configure({ apiKey });
    }
    */
  }, []);
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppStack />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
