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
        <TextInput
          style={styles.input}
          value={results[index]}
          onChangeText={(text) => handleInputChange(text, index)}
          keyboardType={is1000m ? "numbers-and-punctuation" : "decimal-pad"}
          placeholder={HEPTATHLON_PLACEHOLDERS[index]}
          placeholderTextColor="#888"
        />
        <Text style={styles.points}>{points[index]} Points</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        {/* <Text style={styles.title}>Men's Heptathlon Calculator</Text> */}

        {/* Day 1 Events */}
        <Text style={styles.dayTitle}>Day 1</Text>
        {HEPTATHLON_EVENTS.slice(0, 4).map((event, index) =>
          renderEventInput(event, index)
        )}
        <View style={styles.dayTotalContainer}>
          <Text style={styles.dayTotalText}>
            Day 1: {getDay1Total()} Points
          </Text>
        </View>

        {/* Day 2 Events */}
        <Text style={styles.dayTitle}>Day 2</Text>
        {HEPTATHLON_EVENTS.slice(4, 7).map((event, index) =>
          renderEventInput(event, index + 4)
        )}
        <View style={styles.dayTotalContainer}>
          <Text style={styles.dayTotalText}>
            Day 2: {getDay2Total()} Points
          </Text>
        </View>

        {/* Total Score */}
        <View style={styles.totalContainer}>
          <Text style={styles.totalScoreText}>
            Total: {getTotalPoints()} Points
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
    padding: 10, // Reduced padding
  },
  title: {
    // Removed as the title is now handled by navigation
    // fontSize: 24,
    // fontWeight: "bold",
    // color: "#fff",
    // marginBottom: 10,
    // textAlign: "center",
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
    marginBottom: 5,
  },
  eventContainer: {
    marginBottom: 5,
    backgroundColor: "#282828",
    padding: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  eventName: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    minWidth: 80,
  },
  inputContainer: {},
  input: {
    flex: 1,
    height: 35,
    borderWidth: 0,
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#333",
    marginRight: 10,
    color: "#fff",
  },
  points: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    minWidth: 80,
    textAlign: "right",
  },
  dayTotalContainer: {
    backgroundColor: "#282828",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 8,
    alignItems: "center",
  },
  dayTotalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  totalContainer: {
    marginTop: 8,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "#282828",
    borderRadius: 10,
  },
  totalScoreText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  helperText: {},
});
