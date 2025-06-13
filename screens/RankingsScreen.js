import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";

const TRACK_COLOR = "#D35400";

export default function RankingsScreen({ navigation }) {
  const events = [
    { name: "Men's Decathlon", screen: "DecathlonRanking" },
    { name: "Men's Heptathlon", screen: "MenHeptathlonRanking" },
    { name: "Women's Heptathlon", screen: "WomenHeptathlonRanking" },
    { name: "Women's Pentathlon", screen: "WomenPentathlonRanking" },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
        <Text style={styles.title}>World Rankings{"\n"}Calculator</Text>
        {events.map((event, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => navigation.navigate(event.screen)}
          >
            <Text style={styles.buttonText}>{event.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
    lineHeight: 34,
  },
  button: {
    backgroundColor: TRACK_COLOR,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 30,
    width: "100%",
    alignSelf: "center",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
