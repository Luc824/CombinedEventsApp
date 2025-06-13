import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import DecathlonScreen from "./screens/DecathlonScreen";
import MenHeptathlonScreen from "./screens/MenHeptathlonScreen";
import WomenHeptathlonScreen from "./screens/WomenHeptathlonScreen";
import WomenPentathlonScreen from "./screens/WomenPentathlonScreen";
import RankingsScreen from "./screens/RankingsScreen";
import DecathlonRankingScreen from "./screens/DecathlonRankingScreen";
import MenHeptathlonRankingScreen from "./screens/MenHeptathlonRankingScreen";
import WomenHeptathlonRankingScreen from "./screens/WomenHeptathlonRankingScreen";
import WomenPentathlonRankingScreen from "./screens/WomenPentathlonRankingScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1a1a1a",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Decathlon"
          component={DecathlonScreen}
          options={{ title: "Men's Decathlon" }}
        />
        <Stack.Screen
          name="MenHeptathlon"
          component={MenHeptathlonScreen}
          options={{ title: "Men's Heptathlon" }}
        />
        <Stack.Screen
          name="WomenHeptathlon"
          component={WomenHeptathlonScreen}
          options={{ title: "Women's Heptathlon" }}
        />
        <Stack.Screen
          name="WomenPentathlon"
          component={WomenPentathlonScreen}
          options={{ title: "Women's Pentathlon" }}
        />
        <Stack.Screen
          name="Rankings"
          component={RankingsScreen}
          options={{ title: "World Rankings Calculator" }}
        />
        <Stack.Screen
          name="DecathlonRanking"
          component={DecathlonRankingScreen}
          options={{ title: "Men's Decathlon Ranking" }}
        />
        <Stack.Screen
          name="MenHeptathlonRanking"
          component={MenHeptathlonRankingScreen}
          options={{ title: "Men's Heptathlon Ranking" }}
        />
        <Stack.Screen
          name="WomenHeptathlonRanking"
          component={WomenHeptathlonRankingScreen}
          options={{ title: "Women's Heptathlon Ranking" }}
        />
        <Stack.Screen
          name="WomenPentathlonRanking"
          component={WomenPentathlonRankingScreen}
          options={{ title: "Women's Pentathlon Ranking" }}
        />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
