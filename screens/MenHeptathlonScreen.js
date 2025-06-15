import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { worldAthleticsScores } from "../data/worldAthleticsScores";

const TRACK_COLOR = "#D35400";

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
    let formattedText = text.replace(",", ".");
    const eventName = HEPTATHLON_EVENTS[index].name;

    // Handle time-based events (60m, 60m Hurdles, 1000m)
    if (["60m", "60m Hurdles", "1000m"].includes(eventName)) {
      // Remove any non-numeric characters
      formattedText = formattedText.replace(/[^0-9]/g, "");

      // If we have input, format it as mm:ss.ms or ss.ms
      if (formattedText.length > 0) {
        if (eventName === "1000m") {
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
    return points.slice(0, 4).reduce((sum, point) => sum + point, 0);
  };

  const getDay2Total = () => {
    return points.slice(4, 7).reduce((sum, point) => sum + point, 0);
  };

  const getTotalPoints = () => {
    return points.reduce((sum, point) => sum + point, 0);
  };

  const getResultScore = () => {
    const totalPoints = getTotalPoints();
    const scores = Object.keys(worldAthleticsScores.menHeptathlon).map(Number);
    const closestLowerScore = scores
      .filter((score) => score <= totalPoints)
      .sort((a, b) => b - a)[0];
    return closestLowerScore
      ? worldAthleticsScores.menHeptathlon[closestLowerScore]
      : "0";
  };

  const renderEventInput = (event, index) => {
    // Determine placeholder text
    let placeholderText = HEPTATHLON_PLACEHOLDERS[index];

    // Determine maxLength based on event type
    // Add 2 for decimal point and 1 for colon in time events
    const maxLength = event.name === "1000m" ? 7 : 5;

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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={{ flex: 1 }}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Men's Heptathlon</Text>

            {/* Day 1 Events */}
            <Text style={styles.dayTitle}>Day 1: {getDay1Total()} Points</Text>
            {HEPTATHLON_EVENTS.slice(0, 4).map((event, index) =>
              renderEventInput(event, index)
            )}

            {/* Day 2 Events */}
            <Text style={styles.dayTitle}>Day 2: {getDay2Total()} Points</Text>
            {HEPTATHLON_EVENTS.slice(4, 7).map((event, index) =>
              renderEventInput(event, index + 4)
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
    paddingHorizontal: 10,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  dayTitle: {
    fontSize: 22, // Adjusted font size
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 10, // Consistent spacing
  },
  eventContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5, // Reduced margin
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 6, // Reduced padding
  },
  eventName: {
    color: "#fff",
    fontSize: 14, // Adjusted font size
    flex: 1,
    marginRight: 5, // Reduced margin
  },
  input: {
    width: 80, // Reduced width
    height: 30, // Reduced height
    borderWidth: 0,
    borderRadius: 20,
    paddingHorizontal: 8, // Reduced padding
    backgroundColor: "#333",
    marginRight: 5, // Reduced margin
    color: "#fff",
    fontSize: 14, // Reduced font size
    textAlign: "right",
  },
  points: {
    fontSize: 14, // Reduced font size
    fontWeight: "bold",
    color: "#fff",
    width: 90, // Reduced width
    textAlign: "right",
  },
  dayTotalContainer: {
    backgroundColor: "transparent",
    paddingVertical: 4, // Reduced padding
    paddingHorizontal: 5,
    borderRadius: 10,
    marginTop: 4, // Reduced margin
    marginBottom: 4, // Reduced margin
    alignItems: "center",
  },
  dayTotalText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  totalContainer: {
    marginTop: 10, // Adjusted margin
    alignItems: "center",
    paddingVertical: 10, // Adjusted padding
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    marginBottom: 20, // Add some bottom margin to separate from keyboard
  },
  totalText: {
    color: "#fff",
    fontSize: 24, // Score size adjustment
    fontWeight: "bold",
    marginBottom: 5,
  },
  resultScoreText: {
    color: TRACK_COLOR,
    fontSize: 18, // Score size adjustment
    fontWeight: "bold",
  },
  helperText: {},
});
