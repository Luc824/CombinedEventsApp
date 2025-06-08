import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

// Men's Heptathlon events with their formulas
const HEPTATHLON_EVENTS = [
  { name: "60m", formula: (time) => 58.015 * Math.pow(11.5 - time, 1.81) },
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
  {
    name: "60m Hurdles",
    formula: (time) => 20.5173 * Math.pow(15.5 - time, 1.92),
  },
  {
    name: "Pole Vault",
    formula: (height) => 0.2797 * Math.pow(height * 100 - 100, 1.35),
  },
  { name: "1000m", formula: (time) => 0.08713 * Math.pow(305 - time, 1.85) },
];

// Convert time string (mm:ss.ms) to seconds
const convertTimeToSeconds = (timeStr) => {
  if (!timeStr) return 0;

  // Handle decimal format (backward compatibility)
  if (timeStr.includes(".")) {
    return parseFloat(timeStr);
  }

  // Handle mm:ss.ms format
  const parts = timeStr.split(":");
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    return parseFloat(minutes) * 60 + parseFloat(seconds);
  }

  return 0;
};

export default function MenHeptathlonScreen() {
  const [results, setResults] = useState(Array(7).fill(""));
  const [points, setPoints] = useState(Array(7).fill(0));

  const calculatePoints = (value, index) => {
    if (!value) return 0;
    const event = HEPTATHLON_EVENTS[index];
    try {
      // Convert time to seconds for 1000m
      const inputValue =
        index === 6 ? convertTimeToSeconds(value) : parseFloat(value);
      return Math.round(event.formula(inputValue));
    } catch (error) {
      return 0;
    }
  };

  const handleInputChange = (text, index) => {
    // Convert comma to decimal point
    const formattedText = text.replace(",", ".");

    const newResults = [...results];
    newResults[index] = formattedText;
    setResults(newResults);

    const newPoints = [...points];
    newPoints[index] = calculatePoints(formattedText, index);
    setPoints(newPoints);
  };

  const getDay1Total = () => {
    return points.slice(0, 4).reduce((sum, point) => sum + point, 0);
  };

  const getDay2Total = () => {
    return points.slice(4, 7).reduce((sum, point) => sum + point, 0);
  };

  const getTotalPoints = () => {
    return points.reduce((sum, point) => sum + point, 0);
  };

  const renderEventInput = (event, index) => {
    const is1000m = index === 6;
    return (
      <View key={index} style={styles.eventContainer}>
        <Text style={styles.eventName}>{event.name}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={results[index]}
            onChangeText={(text) => handleInputChange(text, index)}
            keyboardType={is1000m ? "numbers-and-punctuation" : "decimal-pad"}
            placeholder={is1000m ? "mm:ss.ms" : "Enter result"}
          />
          <Text style={styles.points}>{points[index]} pts</Text>
        </View>
        {is1000m && (
          <Text style={styles.helperText}>
            Enter time as mm:ss.ms (e.g., 2:30.45)
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Men's Heptathlon Calculator</Text>

        {/* Day 1 Events */}
        <Text style={styles.dayTitle}>Day 1</Text>
        {HEPTATHLON_EVENTS.slice(0, 4).map((event, index) =>
          renderEventInput(event, index)
        )}
        <Text style={styles.dayTotal}>
          Day 1 Total: {getDay1Total()} points
        </Text>

        {/* Day 2 Events */}
        <Text style={styles.dayTitle}>Day 2</Text>
        {HEPTATHLON_EVENTS.slice(4, 7).map((event, index) =>
          renderEventInput(event, index + 4)
        )}
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
  helperText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
    fontStyle: "italic",
  },
});
