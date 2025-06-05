import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// Decathlon events with their formulas
const DECATHLON_EVENTS = [
  { name: "100m", formula: (time) => 25.4347 * Math.pow(18 - time, 1.81) },
  {
    name: "Long Jump",
    formula: (distance) => 0.14354 * Math.pow(distance * 100 - 220, 1.4),
  },
  {
    name: "Shot Put",
    formula: (distance) => 51.39 * Math.pow(distance - 1.5, 1.05),
  },
  {
    name: "High Jump",
    formula: (height) => 0.8465 * Math.pow(height * 100 - 75, 1.42),
  },
  { name: "400m", formula: (time) => 1.53775 * Math.pow(82 - time, 1.81) },
  {
    name: "110m Hurdles",
    formula: (time) => 5.74352 * Math.pow(28.5 - time, 1.92),
  },
  {
    name: "Discus",
    formula: (distance) => 12.91 * Math.pow(distance - 4, 1.1),
  },
  {
    name: "Pole Vault",
    formula: (height) => 0.2797 * Math.pow(height * 100 - 100, 1.35),
  },
  {
    name: "Javelin",
    formula: (distance) => 10.14 * Math.pow(distance - 7, 1.08),
  },
  { name: "1500m", formula: (time) => 0.03768 * Math.pow(480 - time, 1.85) },
];

export default function DecathlonScreen() {
  const [results, setResults] = useState(Array(10).fill(""));
  const [points, setPoints] = useState(Array(10).fill(0));

  const calculatePoints = (value, index) => {
    if (!value) return 0;
    const event = DECATHLON_EVENTS[index];
    try {
      return Math.round(event.formula(parseFloat(value)));
    } catch (error) {
      return 0;
    }
  };

  const handleInputChange = (text, index) => {
    const newResults = [...results];
    newResults[index] = text;
    setResults(newResults);

    const newPoints = [...points];
    newPoints[index] = calculatePoints(text, index);
    setPoints(newPoints);
  };

  const getDay1Total = () => {
    return points.slice(0, 5).reduce((sum, point) => sum + point, 0);
  };

  const getDay2Total = () => {
    return points.slice(5, 10).reduce((sum, point) => sum + point, 0);
  };

  const getTotalPoints = () => {
    return points.reduce((sum, point) => sum + point, 0);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Decathlon Calculator</Text>

        {/* Day 1 Events */}
        <Text style={styles.dayTitle}>Day 1</Text>
        {DECATHLON_EVENTS.slice(0, 5).map((event, index) => (
          <View key={index} style={styles.eventContainer}>
            <Text style={styles.eventName}>{event.name}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={results[index]}
                onChangeText={(text) => handleInputChange(text, index)}
                keyboardType="numeric"
                placeholder="Enter result"
              />
              <Text style={styles.points}>{points[index]} pts</Text>
            </View>
          </View>
        ))}
        <Text style={styles.dayTotal}>
          Day 1 Total: {getDay1Total()} points
        </Text>

        {/* Day 2 Events */}
        <Text style={styles.dayTitle}>Day 2</Text>
        {DECATHLON_EVENTS.slice(5, 10).map((event, index) => (
          <View key={index + 5} style={styles.eventContainer}>
            <Text style={styles.eventName}>{event.name}</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={results[index + 5]}
                onChangeText={(text) => handleInputChange(text, index + 5)}
                keyboardType="numeric"
                placeholder="Enter result"
              />
              <Text style={styles.points}>{points[index + 5]} pts</Text>
            </View>
          </View>
        ))}
        <Text style={styles.dayTotal}>
          Day 2 Total: {getDay2Total()} points
        </Text>

        {/* Total Score */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalScore}>
            Total Score: {getTotalPoints()} points
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2196F3",
    marginBottom: 20,
    textAlign: "center",
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  eventContainer: {
    marginBottom: 15,
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    marginRight: 10,
  },
  points: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
    minWidth: 80,
    textAlign: "right",
  },
  dayTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginBottom: 20,
    textAlign: "right",
  },
  totalContainer: {
    marginTop: 20,
    marginBottom: 40,
    padding: 20,
    backgroundColor: "#2196F3",
    borderRadius: 10,
  },
  totalScore: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});
