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
import { worldAthleticsScores } from "../data/worldAthleticsScores";

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
      if (event.name === "800m") {
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

    // Handle 800m special case
    if (eventName === "800m") {
      // Remove any non-numeric characters
      formattedText = formattedText.replace(/[^0-9]/g, "");

      // If we have input, format it as mm:ss.ms
      if (formattedText.length > 0) {
        // Format as mm:ss.ms
        const minutes = formattedText.slice(0, -4);
        const seconds = formattedText.slice(-4, -2);
        const milliseconds = formattedText.slice(-2);
        formattedText = `${minutes}:${seconds}.${milliseconds}`;
      }
    } else {
      // For all other events, handle decimal point formatting
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

  const getTotalPoints = () => {
    return points.reduce((sum, point) => sum + point, 0);
  };

  const getResultScore = () => {
    const totalPoints = getTotalPoints();
    const scores = Object.keys(worldAthleticsScores.womenPentathlon).map(
      Number
    );
    const closestLowerScore = scores
      .filter((score) => score <= totalPoints)
      .sort((a, b) => b - a)[0];
    return closestLowerScore
      ? worldAthleticsScores.womenPentathlon[closestLowerScore]
      : "0";
  };

  const renderEventInput = (event, index) => {
    // Determine placeholder text
    let placeholderText = PENTATHLON_PLACEHOLDERS[index];

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
        {/* <Text style={styles.title}>Women's Pentathlon Calculator</Text> */}

        {/* Events */}
        {WOMEN_PENTATHLON_EVENTS.map((event, index) =>
          renderEventInput(event, index)
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
  dayTitle: {},
  eventContainer: {
    marginBottom: 2, // Reduced margin
    backgroundColor: "transparent",
    padding: 4, // Reduced padding
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
    width: 110, // Fixed width for alignment
    textAlign: "right",
  },
  inputContainer: {},
  input: {
    width: 90, // Fixed width for uniformity
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
  totalContainer: {
    padding: 10, // Reduced padding
    backgroundColor: "transparent",
    marginTop: 10, // Reduced margin
    marginBottom: 10, // Reduced margin
    borderRadius: 10,
  },
  totalText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  resultScoreText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
    marginTop: 10,
  },
});
