import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { worldAthleticsScores } from "../data/worldAthleticsScores";

const TRACK_COLOR = "#D35400";

export default function WomenHeptathlonRankingScreen() {
  const [totalPoints, setTotalPoints] = useState("");

  const getResultScore = () => {
    if (!totalPoints) return "0";
    const points = parseInt(totalPoints);
    if (isNaN(points)) return "0";

    const scores = Object.keys(worldAthleticsScores.womenHeptathlon).map(
      Number
    );
    const closestLowerScore = scores
      .filter((score) => score <= points)
      .sort((a, b) => b - a)[0];
    return closestLowerScore
      ? worldAthleticsScores.womenHeptathlon[closestLowerScore]
      : "0";
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
        <Text style={styles.title}>Women's Heptathlon</Text>
        <TextInput
          style={styles.input}
          value={totalPoints}
          onChangeText={setTotalPoints}
          keyboardType="numeric"
          placeholder="Enter total points"
          placeholderTextColor="#aaa"
        />
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Result Score</Text>
          <Text style={styles.resultScore}>{getResultScore()}</Text>
        </View>
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
    marginTop: 30,
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    fontSize: 18,
    marginBottom: 30,
    width: "100%",
    textAlign: "center",
  },
  resultContainer: {
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "transparent",
    padding: 20,
    borderRadius: 20,
    width: "100%",
  },
  resultLabel: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  resultScore: {
    color: TRACK_COLOR,
    fontSize: 36,
    fontWeight: "bold",
  },
});
