import React, { useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import { worldAthleticsScores } from "../data/worldAthleticsScores";

const TRACK_COLOR = "#D35400";

const HEPTATHLON_EVENTS = [
  {
    name: "60m",
    formula: (time: number) => 58.015 * Math.pow(11.5 - time, 1.81),
  },
  {
    name: "Long Jump",
    formula: (distance: number) =>
      0.14354 * Math.pow(distance * 100 - 220, 1.4),
  },
  {
    name: "Shot Put",
    formula: (distance: number) => 51.39 * Math.pow(distance - 1.5, 1.05),
  },
  {
    name: "High Jump",
    formula: (height: number) => 0.8465 * Math.pow(height * 100 - 75, 1.42),
  },
  {
    name: "60m Hurdles",
    formula: (time: number) => 20.5173 * Math.pow(15.5 - time, 1.92),
  },
  {
    name: "Pole Vault",
    formula: (height: number) => 0.2797 * Math.pow(height * 100 - 100, 1.35),
  },
  {
    name: "1000m",
    formula: (time: number) => 0.08713 * Math.pow(305.5 - time, 1.85),
  },
];

const HEPTATHLON_PLACEHOLDERS = [
  "6.79", // 60m
  "8.16", // Long Jump
  "14.56", // Shot Put
  "2.03", // High Jump
  "7.68", // 60m Hurdles
  "5.20", // Pole Vault
  "2:32.77", // 1000m
];

// Event labels for chart display (abbreviated)
const EVENT_LABELS = [
  "60m",
  "LJ",
  "SP",
  "HJ",
  "60H",
  "PV",
  "1000m",
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

export default function MenHeptathlonScreen() {
  const [results, setResults] = useState<string[]>(Array(7).fill(""));
  const [points, setPoints] = useState<number[]>(Array(7).fill(0));
  const [showChart, setShowChart] = useState(false);

  const calculatePoints = (value: string, index: number) => {
    if (!value) return 0;
    const event = HEPTATHLON_EVENTS[index];
    try {
      const inputValue =
        index === 6 ? convertTimeToSeconds(value) : parseFloat(value);
      return Math.floor(event.formula(inputValue));
    } catch (error) {
      return 0;
    }
  };

  const handleInputChange = (text: string, index: number) => {
    let formattedText = text.replace(",", ".");
    const eventName = HEPTATHLON_EVENTS[index].name;
    if (["60m", "60m Hurdles", "1000m"].includes(eventName)) {
      formattedText = formattedText.replace(/[^0-9]/g, "");
      if (formattedText.length > 0) {
        if (eventName === "1000m") {
          const minutes = formattedText.slice(0, -4);
          const seconds = formattedText.slice(-4, -2);
          const milliseconds = formattedText.slice(-2);
          formattedText = `${minutes}:${seconds}.${milliseconds}`;
        } else {
          const seconds = formattedText.slice(0, -2);
          const milliseconds = formattedText.slice(-2);
          formattedText = `${seconds}.${milliseconds}`;
        }
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

  const getDay1Total = () =>
    points.slice(0, 4).reduce((sum, point) => sum + point, 0);
  const getDay2Total = () =>
    points.slice(4, 7).reduce((sum, point) => sum + point, 0);
  const getTotalPoints = () => points.reduce((sum, point) => sum + point, 0);
  const getResultScore = () => {
    const totalPoints = getTotalPoints();
    const scores = Object.keys(worldAthleticsScores.menHeptathlon).map(Number);
    const closestLowerScore = scores
      .filter((score) => score <= totalPoints)
      .sort((a, b) => b - a)[0];
    return closestLowerScore
      ? worldAthleticsScores.menHeptathlon[
          closestLowerScore as keyof typeof worldAthleticsScores.menHeptathlon
        ]
      : "0";
  };

  const clearAll = () => {
    setResults(Array(7).fill(""));
    setPoints(Array(7).fill(0));
  };

  const renderEventInput = (
    event: (typeof HEPTATHLON_EVENTS)[0],
    index: number
  ) => {
    let placeholderText = HEPTATHLON_PLACEHOLDERS[index];
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

  const renderBarChart = () => {
    const maxPoints = Math.max(...points, 1000); // Minimum scale of 1000
    const chartHeight = 200;
    const barWidth = 22;
    const barSpacing = 4;

    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Performance Overview</Text>
        <View style={styles.chartContent}>
          {points.map((pointValue, index) => {
            const barHeight = maxPoints > 0 ? (pointValue / maxPoints) * chartHeight : 0;
            return (
              <View
                key={index}
                style={[
                  styles.barWrapper,
                  { width: barWidth + barSpacing * 2 },
                ]}
              >
                <Text style={styles.barValue}>{pointValue}</Text>
                <View style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        width: barWidth,
                        height: Math.max(barHeight, 2), // Minimum height for visibility
                        backgroundColor: TRACK_COLOR,
                      },
                    ]}
                  />
                </View>
                <View style={styles.barLabelContainer}>
                  <Text style={styles.barLabel} numberOfLines={1}>
                    {EVENT_LABELS[index]}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
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
            {HEPTATHLON_EVENTS.map((event, index) => (
              <React.Fragment key={index}>
                {renderEventInput(event, index)}
                {index === 3 && (
                  <>
                    <View style={{ height: 6 }} />
                    <Text style={styles.inlineDayTotalText}>
                      Day 1: {getDay1Total()} Points
                    </Text>
                    <View style={{ height: 10 }} />
                  </>
                )}
                {index === 6 && (
                  <>
                    <View style={{ height: 6 }} />
                    <Text style={styles.inlineDayTotalText}>
                      Day 2: {getDay2Total()} Points
                    </Text>
                    <View style={{ height: 10 }} />
                  </>
                )}
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
            <TouchableOpacity
              style={styles.chartButton}
              onPress={() => setShowChart(true)}
            >
              <Text style={styles.chartButtonText}>View Chart</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <Modal
        visible={showChart}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowChart(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => setShowChart(false)}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContentWrapper}>
            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              style={styles.modalScrollView}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Men's Heptathlon</Text>
                  <TouchableOpacity
                    onPress={() => setShowChart(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.totalScoreCard}>
                  <Text style={styles.totalScoreLabel}>Total Score</Text>
                  <Text style={styles.totalScoreValue}>
                    {getTotalPoints()}
                  </Text>
                  <Text style={styles.totalScoreUnit}>Points</Text>
                </View>
                {renderBarChart()}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    paddingTop: 10,
    paddingBottom: 30,
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
  inlineDayTotalText: {
    color: "#bbb",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 2,
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
  chartButton: {
    backgroundColor: "#222",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: "center",
    marginVertical: 8,
    alignSelf: "center",
    borderWidth: 1,
    borderColor: TRACK_COLOR,
  },
  chartButtonText: {
    color: TRACK_COLOR,
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentWrapper: {
    position: "absolute",
    width: "90%",
    maxWidth: 400,
    maxHeight: "90%",
  },
  modalScrollView: {
    width: "100%",
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  modalContent: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 20,
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  totalScoreCard: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  totalScoreLabel: {
    color: "#bbb",
    fontSize: 14,
    marginBottom: 4,
  },
  totalScoreValue: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 2,
  },
  totalScoreUnit: {
    color: "#fff",
    fontSize: 14,
  },
  chartContainer: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
  },
  chartTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  chartContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 240,
    paddingHorizontal: 8,
  },
  barWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  barValue: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  barContainer: {
    width: "100%",
    height: 200,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bar: {
    borderRadius: 4,
    minHeight: 2,
  },
  barLabelContainer: {
    height: 20,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 6,
  },
  barLabel: {
    color: "#fff",
    fontSize: 10,
    textAlign: "center",
    width: "100%",
  },
});
