import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { worldAthleticsScores } from "../data/worldAthleticsScores";

const TRACK_COLOR = "#D35400";

const WOMEN_PENTATHLON_EVENTS = [
  {
    name: "60m Hurdles",
    formula: (time: number) => 20.0479 * Math.pow(17.0 - time, 1.835),
  },
  {
    name: "High Jump",
    formula: (height: number) => 1.84523 * Math.pow(height - 75, 1.348),
  },
  {
    name: "Shot Put",
    formula: (distance: number) => 56.0211 * Math.pow(distance - 1.5, 1.05),
  },
  {
    name: "Long Jump",
    formula: (distance: number) => 0.188807 * Math.pow(distance - 210, 1.41),
  },
  {
    name: "800m",
    formula: (time: number) => 0.11193 * Math.pow(254 - time, 1.88),
  },
];

const PENTATHLON_PLACEHOLDERS = [
  "8.23", // 60m Hurdles
  "1.92", // High Jump (meters)
  "15.54", // Shot Put (meters)
  "6.59", // Long Jump (meters)
  "2:13.60", // 800m
];

const convertTimeToSeconds = (timeStr: string) => {
  if (!timeStr) return 0;
  timeStr = timeStr.replace(",", ".");
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
  const [results, setResults] = useState<string[]>(Array(5).fill(""));
  const [points, setPoints] = useState<number[]>(Array(5).fill(0));

  const calculatePoints = (value: string, index: number) => {
    if (!value) return 0;
    const event = WOMEN_PENTATHLON_EVENTS[index];
    let inputValue = parseFloat(value);
    try {
      if (event.name === "800m") {
        inputValue = convertTimeToSeconds(value);
      } else if (event.name === "High Jump" || event.name === "Long Jump") {
        inputValue = parseFloat(value) * 100;
      }
      return Math.floor(event.formula(inputValue));
    } catch (error) {
      return 0;
    }
  };

  const handleInputChange = (text: string, index: number) => {
    let formattedText = text.replace(",", ".");
    const eventName = WOMEN_PENTATHLON_EVENTS[index].name;
    if (eventName === "800m") {
      formattedText = formattedText.replace(/[^0-9]/g, "");
      if (formattedText.length > 0) {
        const minutes = formattedText.slice(0, -4);
        const seconds = formattedText.slice(-4, -2);
        const milliseconds = formattedText.slice(-2);
        formattedText = `${minutes}:${seconds}.${milliseconds}`;
      }
    } else {
      formattedText = formattedText.replace(/[^0-9]/g, "");
      if (formattedText.length > 0) {
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

  const getTotalPoints = () => points.reduce((sum, point) => sum + point, 0);
  const getResultScore = () => {
    const totalPoints = getTotalPoints();
    const scores = Object.keys(worldAthleticsScores.womenPentathlon).map(
      Number
    );
    const closestLowerScore = scores
      .filter((score) => score <= totalPoints)
      .sort((a, b) => b - a)[0];
    return closestLowerScore
      ? worldAthleticsScores.womenPentathlon[
          closestLowerScore as keyof typeof worldAthleticsScores.womenPentathlon
        ]
      : "0";
  };

  const clearAll = () => {
    setResults(Array(5).fill(""));
    setPoints(Array(5).fill(0));
  };

  const renderEventInput = (
    event: (typeof WOMEN_PENTATHLON_EVENTS)[0],
    index: number
  ) => {
    let placeholderText = PENTATHLON_PLACEHOLDERS[index];
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
            <Text style={styles.title}>Women's Pentathlon</Text>
            {WOMEN_PENTATHLON_EVENTS.map((event, index) => (
              <React.Fragment key={index}>
                {renderEventInput(event, index)}
              </React.Fragment>
            ))}
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>
                Total Score: {getTotalPoints()} Points
              </Text>
              <Text style={styles.resultScoreText}>
                Result Score: {getResultScore()}
              </Text>
            </View>
            <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
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
  inlineDayTotalText: {
    color: "#bbb",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 2,
  },
  clearButton: {
    backgroundColor: TRACK_COLOR,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: "center",
    marginVertical: 16,
    alignSelf: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
