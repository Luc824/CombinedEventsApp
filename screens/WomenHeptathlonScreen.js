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

// Women's Heptathlon events with their formulas
const WOMEN_HEPTATHLON_EVENTS = [
  {
    name: "100m Hurdles",
    formula: (time) => 9.23076 * Math.pow(26.7 - time, 1.835),
  },
  {
    name: "High Jump",
    formula: (height) => 1.84523 * Math.pow(height - 75, 1.348),
  },
  {
    name: "Shot Put",
    formula: (distance) => 56.0211 * Math.pow(distance - 1.5, 1.05),
  },
  { name: "200m", formula: (time) => 4.99087 * Math.pow(42.5 - time, 1.81) },
  {
    name: "Long Jump",
    formula: (distance) => 0.188807 * Math.pow(distance - 210, 1.41),
  },
  {
    name: "Javelin Throw",
    formula: (distance) => 15.9803 * Math.pow(distance - 3.8, 1.04),
  },
  { name: "800m", formula: (time) => 0.11193 * Math.pow(254 - time, 1.88) },
];

// Specific placeholders for each event
const HEPTATHLON_PLACEHOLDERS = [
  "12.69", // 100m Hurdles
  "1.86", // High Jump (meters)
  "15.80", // SHot Put (meters)
  "22.56", // 200m
  "7.27", // Long Jump (meters)
  "45.66", // Javelin Throw (meters)
  "2:08.51", // 800m
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

export default function WomenHeptathlonScreen() {
  const [results, setResults] = useState(Array(7).fill(""));
  const [points, setPoints] = useState(Array(7).fill(0));

  const calculatePoints = (value, index) => {
    if (!value) return 0;
    const event = WOMEN_HEPTATHLON_EVENTS[index];
    let inputValue = parseFloat(value);

    try {
      // Handle specific input types for formulas
      if (event.name === "800m") {
        inputValue = convertTimeToSeconds(value);
      } else if (event.name === "High Jump" || event.name === "Long Jump") {
        // Convert meters to centimeters for jumping event formulas
        inputValue = parseFloat(value) * 100;
      }
      // For Shot Put and Javelin Throw, value is already in meters, which is correct for formula

      return Math.floor(event.formula(inputValue));
    } catch (error) {
      return 0;
    }
  };

  const handleInputChange = (text, index) => {
    let formattedText = text.replace(",", ".");
    const eventName = WOMEN_HEPTATHLON_EVENTS[index].name;

    // Handle time-based events (100m Hurdles, 200m, 800m)
    if (["100m Hurdles", "200m", "800m"].includes(eventName)) {
      // Remove any non-numeric characters
      formattedText = formattedText.replace(/[^0-9]/g, "");

      // If we have input, format it as mm:ss.ms or ss.ms
      if (formattedText.length > 0) {
        if (eventName === "800m") {
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
    const scores = Object.keys(worldAthleticsScores.womenHeptathlon).map(
      Number
    );
    const closestLowerScore = scores
      .filter((score) => score <= totalPoints)
      .sort((a, b) => b - a)[0];
    return closestLowerScore
      ? worldAthleticsScores.womenHeptathlon[closestLowerScore]
      : "0";
  };

  const renderEventInput = (event, index) => {
    // Determine placeholder text
    let placeholderText = HEPTATHLON_PLACEHOLDERS[index];

    // Determine maxLength based on event type
    // Add 2 for decimal point and 1 for colon in time events
    const maxLength = event.name === "800m" ? 7 : 5;

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
      <ScrollView style={styles.scrollView}>
        {/* <Text style={styles.title}>Women's Heptathlon Calculator</Text> */}

        {/* Day 1 Events */}
        <Text style={styles.dayTitle}>Day 1</Text>
        {WOMEN_HEPTATHLON_EVENTS.slice(0, 4).map((event, index) =>
          renderEventInput(event, index)
        )}
        <View style={styles.dayTotalContainer}>
          <Text style={styles.dayTotalText}>
            Day 1: {getDay1Total()} Points
          </Text>
        </View>

        {/* Day 2 Events */}
        <Text style={styles.dayTitle}>Day 2</Text>
        {WOMEN_HEPTATHLON_EVENTS.slice(4, 7).map((event, index) =>
          renderEventInput(event, index + 4)
        )}
        <View style={styles.dayTotalContainer}>
          <Text style={styles.dayTotalText}>
            Day 2: {getDay2Total()} Points
          </Text>
        </View>

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
  dayTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 10,
  },
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
    fontSize: 16,
    textAlign: "right",
  },
  points: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    width: 110,
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
