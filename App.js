import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import HomeScreen from "./screens/HomeScreen";
import MenScreen from "./screens/MenScreen";
import WomenScreen from "./screens/WomenScreen";
import DecathlonScreen from "./screens/DecathlonScreen";
import MenHeptathlonScreen from "./screens/MenHeptathlonScreen";
import WomenHeptathlonScreen from "./screens/WomenHeptathlonScreen";
import WomenPentathlonScreen from "./screens/WomenPentathlonScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Combined Events Calculator",
            headerStyle: {
              backgroundColor: "#2196F3",
            },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Men"
          component={MenScreen}
          options={{
            title: "Men's Events",
            headerStyle: {
              backgroundColor: "#2196F3",
            },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Women"
          component={WomenScreen}
          options={{
            title: "Women's Events",
            headerStyle: {
              backgroundColor: "#2196F3",
            },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="Decathlon"
          component={DecathlonScreen}
          options={{
            title: "Decathlon Calculator",
            headerStyle: {
              backgroundColor: "#2196F3",
            },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="MenHeptathlon"
          component={MenHeptathlonScreen}
          options={{
            title: "Men's Heptathlon Calculator",
            headerStyle: {
              backgroundColor: "#2196F3",
            },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="WomenHeptathlon"
          component={WomenHeptathlonScreen}
          options={{
            title: "Women's Heptathlon Calculator",
            headerStyle: {
              backgroundColor: "#2196F3",
            },
            headerTintColor: "#fff",
          }}
        />
        <Stack.Screen
          name="WomenPentathlon"
          component={WomenPentathlonScreen}
          options={{
            title: "Women's Pentathlon Calculator",
            headerStyle: {
              backgroundColor: "#2196F3",
            },
            headerTintColor: "#fff",
          }}
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
