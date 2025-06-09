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

// Women's Pentathlon events with their formulas
const WOMEN_PENTATHLON_EVENTS = [
  {
    name: "60m Hurdles",
    formula: (time) => 20.0479 * Math.pow(17.0 - time, 1.835),
  },
  {
    name: "High Jump",
    formula: (height) => 1.84523 * Math.pow(height - 75, 1.348),
  },
  {
    name: "Shot Put",
    formula: (distance) => 56.0211 * Math.pow(distance - 1.5, 1.05),
  },
  {
    name: "Long Jump",
    formula: (distance) => 0.188807 * Math.pow(distance - 210, 1.41),
  },
  { name: "800m", formula: (time) => 0.11193 * Math.pow(254 - time, 1.88) },
];

// Specific placeholders for each event
const PENTATHLON_PLACEHOLDERS = [
  "8.23", // 60m Hurdles
  "1.92", // High Jump (meters)
  "15.54", // Shot Put (meters)
  "6.59", // Long Jump (meters)
  "2:13.60", // 800m
];

// Convert time string (mm:ss.ms) to seconds
const convertTimeToSeconds = (timeStr) => {
  if (!timeStr) return 0;
  timeStr = timeStr.replace(",", "."); // Ensure any commas are converted to decimal points

  const parts = timeStr.split(":");

  if (parts.length === 2) {
    const minutes = parseFloat(parts[0]);
    const secondsAndMs = parseFloat(parts[1]);
    if (isNaN(minutes) || isNaN(secondsAndMs)) return 0;
    return minutes * 60 + secondsAndMs;
  } else if (parts.length === 1 && !isNaN(parseFloat(parts[0]))) {
    return parseFloat(parts[0]);
  }
  return 0;
};

export default function WomenPentathlonScreen() {
  const [results, setResults] = useState(Array(5).fill(""));
  const [points, setPoints] = useState(Array(5).fill(0));

  const calculatePoints = (value, index) => {
    if (!value) return 0;
    const event = WOMEN_PENTATHLON_EVENTS[index];
    let inputValue = parseFloat(value);

    try {
      // Handle specific input types for formulas
      if (event.name === "60m Hurdles" || event.name === "800m") {
        inputValue = convertTimeToSeconds(value);
      } else if (event.name === "High Jump" || event.name === "Long Jump") {
        // Convert meters to centimeters for jumping event formulas
        inputValue = parseFloat(value) * 100;
      }
      // For Shot Put, value is already in meters, which is correct for formula

      return Math.floor(event.formula(inputValue));
    } catch (error) {
      return 0;
    }
  };

  const handleInputChange = (text, index) => {
    let formattedText = text.replace(",", ".");
    const eventName = WOMEN_PENTATHLON_EVENTS[index].name;

    // Restrict input for time events to numbers, ":", and "."
    if (eventName === "60m Hurdles" || eventName === "800m") {
      formattedText = formattedText.replace(/[^0-9.:]/g, "");
    }

    const newResults = [...results];
    newResults[index] = formattedText;
    setResults(newResults);

    const newPoints = [...points];
    newPoints[index] = calculatePoints(formattedText, index);
    setPoints(newPoints);
  };

  const getTotalPoints = () => {
    return points.reduce((sum, point) => sum + point, 0);
  };

  const renderEventInput = (event, index) => {
    const isTimeEvent = event.name === "60m Hurdles" || event.name === "800m";

    // Determine placeholder text
    let placeholderText = PENTATHLON_PLACEHOLDERS[index];

    return (
      <View key={index} style={styles.eventContainer}>
        <Text style={styles.eventName}>{event.name}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={results[index]}
            onChangeText={(text) => handleInputChange(text, index)}
            keyboardType={
              isTimeEvent ? "numbers-and-punctuation" : "decimal-pad"
            }
            placeholder={placeholderText}
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
        <Text style={styles.title}>Women's Pentathlon Calculator</Text>

        {/* Events */}
        {WOMEN_PENTATHLON_EVENTS.map((event, index) =>
          renderEventInput(event, index)
        )}

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
    // Removed placeholderTextColor from here as it's a direct prop of TextInput
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
