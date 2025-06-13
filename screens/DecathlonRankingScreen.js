import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { worldAthleticsScores } from "../data/worldAthleticsScores";

export default function DecathlonRankingScreen() {
  const [totalPoints, setTotalPoints] = useState("");

  const getResultScore = () => {
    if (!totalPoints) return "0";
    const points = parseInt(totalPoints);
    if (isNaN(points)) return "0";

    const scores = Object.keys(worldAthleticsScores.decathlon).map(Number);
    const closestLowerScore = scores
      .filter((score) => score <= points)
      .sort((a, b) => b - a)[0];
    return closestLowerScore
      ? worldAthleticsScores.decathlon[closestLowerScore]
      : "0";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Men's Decathlon</Text>
      <Text style={styles.subtitle}>Enter your total points:</Text>

      <TextInput
        style={styles.input}
        value={totalPoints}
        onChangeText={setTotalPoints}
        keyboardType="numeric"
        placeholder="Enter total points"
        placeholderTextColor="#666"
      />

      <View style={styles.resultContainer}>
        <Text style={styles.resultLabel}>Result Score:</Text>
        <Text style={styles.resultScore}>{getResultScore()}</Text>
      </View>
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
  input: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    fontSize: 18,
    marginBottom: 30,
  },
  resultContainer: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  resultLabel: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
  },
  resultScore: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
});
