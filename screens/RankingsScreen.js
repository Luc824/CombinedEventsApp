import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function RankingsScreen({ navigation }) {
  const events = [
    { name: "Men's Decathlon", screen: "DecathlonRanking" },
    { name: "Men's Heptathlon", screen: "MenHeptathlonRanking" },
    { name: "Women's Heptathlon", screen: "WomenHeptathlonRanking" },
    { name: "Women's Pentathlon", screen: "WomenPentathlonRanking" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>World Rankings Calculator</Text>
      <Text style={styles.subtitle}>
        Select an event to calculate your result score:
      </Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
});
