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

    // Restrict input for time events to numbers, ":", and "."
    if (eventName === "800m") {
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
    const isTimeEvent = event.name === "800m";

    // Determine placeholder text
    let placeholderText = HEPTATHLON_PLACEHOLDERS[index];

    return (
      <View key={index} style={styles.eventContainer}>
        <Text style={styles.eventName}>{event.name}</Text>
        <TextInput
          style={styles.input}
          value={results[index]}
          onChangeText={(text) => handleInputChange(text, index)}
          keyboardType={isTimeEvent ? "numbers-and-punctuation" : "decimal-pad"}
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
});
