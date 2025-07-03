import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="decathlon" options={{ headerShown: false }} />
      <Stack.Screen name="men-heptathlon" options={{ headerShown: false }} />
      <Stack.Screen name="women-heptathlon" options={{ headerShown: false }} />
      <Stack.Screen name="women-pentathlon" options={{ headerShown: false }} />
      <Stack.Screen name="decathlon-ranking" options={{ headerShown: false }} />
      <Stack.Screen
        name="men-heptathlon-ranking"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="women-heptathlon-ranking"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="women-pentathlon-ranking"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
