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
  { name: "1000m", formula: (time) => 0.08713 * Math.pow(305.5 - time, 1.85) },
];

// Specific placeholders for each event
const HEPTATHLON_PLACEHOLDERS = [
  "6.79", // 60m
  "8.16", // Long Jump
  "14.56", // Shot Put
  "2.03", // High Jump
  "7.68", // 60m Hurdles
  "5.20", // Pole Vault
  "2:32.77", // 1000m
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
      return Math.floor(event.formula(inputValue));
    } catch (error) {
      return 0;
    }
  };

  const handleInputChange = (text, index) => {
    // Convert comma to decimal point
    let formattedText = text.replace(",", ".");

    // For 1000m, restrict input to numbers, ":", and "."
    if (index === 6) {
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
            placeholder={
              is1000m
                ? HEPTATHLON_PLACEHOLDERS[index]
                : HEPTATHLON_PLACEHOLDERS[index]
            }
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
});
