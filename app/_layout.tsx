import Constants from "expo-constants";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";

export default function RootLayout() {
  useEffect(() => {
    const apiKey =
      Platform.select({
        ios: Constants.expoConfig?.extra?.revenueCatApiKeyIos,
        android: Constants.expoConfig?.extra?.revenueCatApiKeyAndroid,
        default: undefined,
      }) || undefined;
    if (apiKey) {
      Purchases.configure({ apiKey });
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
