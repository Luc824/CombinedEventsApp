import Constants from "expo-constants";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";

// Check if we're in Expo Go (RevenueCat won't work here)
const isExpoGo = Constants.executionEnvironment === "storeClient";

// Safely import RevenueCat - will be null in Expo Go
let Purchases: any = null;
if (!isExpoGo) {
  try {
    Purchases = require("react-native-purchases").default;
  } catch (e) {
    // RevenueCat not available
    console.log("RevenueCat not available");
  }
}

export default function RootLayout() {
  useEffect(() => {
    if (!isExpoGo && Purchases) {
      const apiKey =
        Platform.select({
          ios: Constants.expoConfig?.extra?.revenueCatApiKeyIos,
          android: Constants.expoConfig?.extra?.revenueCatApiKeyAndroid,
          default: undefined,
        }) || undefined;
      if (apiKey) {
        try {
          Purchases.configure({ apiKey });
        } catch (e) {
          console.warn("Failed to configure RevenueCat:", e);
        }
      }
    }
  }, []);
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="decathlon" options={{ headerShown: false }} />
      <Stack.Screen name="men-heptathlon" options={{ headerShown: false }} />
      <Stack.Screen name="women-heptathlon" options={{ headerShown: false }} />
      <Stack.Screen name="women-pentathlon" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
