import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { worldAthleticsScores } from "../data/worldAthleticsScores";

const TRACK_COLOR = "#D35400";

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
    let formattedText = text.replace(",", ".");
    const eventName = DECATHLON_EVENTS[index].name;

    // Handle time-based events (100m, 400m, 110m Hurdles, 1500m)
    if (["100m", "400m", "110m Hurdles", "1500m"].includes(eventName)) {
      // Remove any non-numeric characters
      formattedText = formattedText.replace(/[^0-9]/g, "");

      // If we have input, format it as mm:ss.ms or ss.ms
      if (formattedText.length > 0) {
        if (eventName === "1500m") {
          // Format as mm:ss.ms
          const minutes = formattedText.slice(0, -4);
          const seconds = formattedText.slice(-4, -2);
          const milliseconds = formattedText.slice(-2);
          formattedText = `${minutes}:${seconds}.${milliseconds}`;
        } else {
          // Format as ss.ms
          const seconds = formattedText.slice(0, -2);
          const milliseconds = formattedText.slice(-2);
          formattedText = `${seconds}.${milliseconds}`;
        }
      }
    } else {
      // For all other events (jumping and throwing), handle decimal point formatting
      // Remove any non-numeric characters
      formattedText = formattedText.replace(/[^0-9]/g, "");

      // If we have input, format it with decimal point
      if (formattedText.length > 0) {
        // Insert decimal point 2 places from the right
        const beforeDecimal = formattedText.slice(0, -2);
        const afterDecimal = formattedText.slice(-2);
        formattedText = beforeDecimal + "." + afterDecimal;
      }
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

  const getResultScore = () => {
    const totalPoints = getTotalPoints();
    const scores = Object.keys(worldAthleticsScores.decathlon).map(Number);
    const closestLowerScore = scores
      .filter((score) => score <= totalPoints)
      .sort((a, b) => b - a)[0];
    return closestLowerScore
      ? worldAthleticsScores.decathlon[closestLowerScore]
      : "0";
  };

  const renderEventInput = (event, index) => {
    // Determine placeholder text
    let placeholderText = PLACEHOLDERS[index];

    // Determine maxLength based on event type
    // Add 2 for decimal point and 1 for colon in time events
    const maxLength = event.name === "1500m" ? 7 : 5;

    return (
      <View key={index} style={styles.eventContainer}>
        <Text style={styles.eventName}>{event.name}</Text>
        <TextInput
          style={styles.input}
          value={results[index]}
          onChangeText={(text) => handleInputChange(text, index)}
          keyboardType="decimal-pad"
          placeholder={placeholderText}
          placeholderTextColor="#888"
          maxLength={maxLength}
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View style={styles.contentContainer}>
          {/* <Text style={styles.title}>Men's Decathlon Calculator</Text> */}

          {/* Day 1 Events */}
          <Text style={styles.dayTitle}>Day 1</Text>
          {DECATHLON_EVENTS.slice(0, 5).map((event, index) =>
            renderEventInput(event, index)
          )}

          {/* Day 2 Events */}
          <Text style={styles.dayTitle}>Day 2</Text>
          {DECATHLON_EVENTS.slice(5).map((event, index) =>
            renderEventInput(event, index + 5)
          )}

          {/* Total Score */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>
              Total Score: {getTotalPoints()} Points
            </Text>
            <Text style={styles.resultScoreText}>
              Result Score: {getResultScore()}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 10,
    paddingTop: 50,
    justifyContent: "flex-start",
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingTop: 0,
    marginTop: 0,
  },
  title: {
    // Removed as the title is now handled by navigation
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 10,
  },
  eventContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 6,
  },
  eventName: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
    marginRight: 5,
  },
  input: {
    width: 80,
    height: 30,
    borderWidth: 0,
    borderRadius: 20,
    paddingHorizontal: 8,
    backgroundColor: "#333",
    marginRight: 5,
    color: "#fff",
    fontSize: 14,
    textAlign: "right",
  },
  points: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
    width: 90,
    textAlign: "right",
  },
  totalContainer: {
    marginTop: 10,
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    marginBottom: 20,
  },
  totalText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  resultScoreText: {
    color: TRACK_COLOR,
    fontSize: 18,
    fontWeight: "bold",
  },
});
