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

// Specific placeholders for each event
const PLACEHOLDERS = [
  "10.55", // 100m
  "7.80", // Long Jump
  "16.00", // Shot Put
  "2.05", // High Jump
  "48.42", // 400m
  "13.75", // 110m Hurdles
  "50.54", // Discus Throw
  "5.45", // Pole Vault
  "71.90", // Javelin Throw
  "4:36.11", // 1500m
];

// Convert time string (mm:ss.ms) to seconds
const convertTimeToSeconds = (timeStr) => {
  if (!timeStr) return 0;

  // Ensure any commas are converted to decimal points
  timeStr = timeStr.replace(",", ".");

  const parts = timeStr.split(":");

  if (parts.length === 2) {
    // This handles "mm:ss.ms" or "mm:ss" formats
    const minutes = parseFloat(parts[0]);
    const secondsAndMs = parseFloat(parts[1]);

    // Basic validation: ensure minutes and seconds are valid numbers
    if (isNaN(minutes) || isNaN(secondsAndMs)) {
      return 0;
    }

    return minutes * 60 + secondsAndMs;
  } else if (parts.length === 1 && !isNaN(parseFloat(parts[0]))) {
    // This handles cases where only seconds (with or without milliseconds) are entered, like "32.11"
    return parseFloat(parts[0]);
  }

  return 0; // Return 0 for any other invalid format
};

export default function DecathlonScreen() {
  const [results, setResults] = useState(Array(10).fill(""));
  const [points, setPoints] = useState(Array(10).fill(0));

  const calculatePoints = (value, index) => {
    if (!value) return 0;
    const event = DECATHLON_EVENTS[index];
    try {
      // Convert time to seconds for 1500m
      const inputValue =
        index === 9 ? convertTimeToSeconds(value) : parseFloat(value);
      return Math.floor(event.formula(inputValue));
    } catch (error) {
      return 0;
    }
  };

  const handleInputChange = (text, index) => {
    // Convert comma to decimal point
    let formattedText = text.replace(",", ".");

    // For 1500m, restrict input to numbers, ":", and "."
    if (index === 9) {
      formattedText = formattedText.replace(/[^0-9.:]/g, "");
    }

    const newResults = [...results];
    newResults[index] = formattedText;
    setResults(newResults);

    const newPoints = [...points];
    newPoints[index] = calculatePoints(formattedText, index);
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

  const renderEventInput = (event, index) => {
    const is1500m = index === 9;
    return (
      <View key={index} style={styles.eventContainer}>
        <Text style={styles.eventName}>{event.name}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={results[index]}
            onChangeText={(text) => handleInputChange(text, index)}
            keyboardType={is1500m ? "numbers-and-punctuation" : "decimal-pad"}
            placeholder={is1500m ? PLACEHOLDERS[index] : PLACEHOLDERS[index]}
            placeholderTextColor="#888"
          />
          <Text style={styles.points}>{points[index]} pts</Text>
        </View>
      </View>
    );
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
        {DECATHLON_EVENTS.slice(0, 5).map((event, index) =>
          renderEventInput(event, index)
        )}
        <Text style={styles.dayTotal}>
          Day 1 Total: {getDay1Total()} points
        </Text>

        {/* Day 2 Events */}
        <Text style={styles.dayTitle}>Day 2</Text>
        {DECATHLON_EVENTS.slice(5, 10).map((event, index) =>
          renderEventInput(event, index + 5)
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
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
    marginBottom: 10,
  },
  eventContainer: {
    marginBottom: 15,
    backgroundColor: "#282828",
    padding: 15,
    borderRadius: 10,
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#fff",
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
    borderColor: "transparent",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#282828",
    marginRight: 10,
    placeholderTextColor: "#888",
    color: "#fff",
  },
  points: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    minWidth: 80,
    textAlign: "right",
  },
  dayTotal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    marginBottom: 20,
    textAlign: "right",
  },
  totalContainer: {
    marginTop: 20,
    marginBottom: 40,
    padding: 20,
    backgroundColor: "#333",
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
    fontStyle: "italic",
  },
});
