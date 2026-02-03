import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { worldAthleticsScores } from "../data/worldAthleticsScores";
import { saveScore } from "../utils/scoreStorage";

const TRACK_COLOR = "#D35400";

const WOMEN_HEPTATHLON_EVENTS = [
  {
    name: "100m Hurdles",
    formula: (time: number) => 9.23076 * Math.pow(26.7 - time, 1.835),
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
    name: "200m",
    formula: (time: number) => 4.99087 * Math.pow(42.5 - time, 1.81),
  },
  {
    name: "Long Jump",
    formula: (distance: number) => 0.188807 * Math.pow(distance - 210, 1.41),
  },
  {
    name: "Javelin Throw",
    formula: (distance: number) => 15.9803 * Math.pow(distance - 3.8, 1.04),
  },
  {
    name: "800m",
    formula: (time: number) => 0.11193 * Math.pow(254 - time, 1.88),
  },
];

const HEPTATHLON_PLACEHOLDERS = [
  "12.69", // 100m Hurdles
  "1.86", // High Jump (meters)
  "15.80", // Shot Put (meters)
  "22.56", // 200m
  "7.27", // Long Jump (meters)
  "45.66", // Javelin Throw (meters)
  "2:08.51", // 800m
];

// Event labels for chart display (abbreviated)
const EVENT_LABELS = [
  "100H",
  "HJ",
  "SP",
  "200m",
  "LJ",
  "JT",
  "800m",
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

export default function WomenHeptathlonScreen() {
  const [results, setResults] = useState<string[]>(Array(7).fill(""));
  const [points, setPoints] = useState<number[]>(Array(7).fill(0));
  const [showChart, setShowChart] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");

  const calculatePoints = (value: string, index: number) => {
    if (!value) return 0;
    const event = WOMEN_HEPTATHLON_EVENTS[index];
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
    const eventName = WOMEN_HEPTATHLON_EVENTS[index].name;
    if (["100m Hurdles", "200m", "800m"].includes(eventName)) {
      formattedText = formattedText.replace(/[^0-9]/g, "");
      if (formattedText.length > 0) {
        if (eventName === "800m") {
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
    const scores = Object.keys(worldAthleticsScores.womenHeptathlon).map(
      Number
    );
    const closestLowerScore = scores
      .filter((score) => score <= totalPoints)
      .sort((a, b) => b - a)[0];
    return closestLowerScore
      ? worldAthleticsScores.womenHeptathlon[
          closestLowerScore as keyof typeof worldAthleticsScores.womenHeptathlon
        ]
      : "0";
  };

  const clearAll = () => {
    setResults(Array(7).fill(""));
    setPoints(Array(7).fill(0));
  };

  const handleSaveScore = async () => {
    if (!saveTitle.trim()) {
      Alert.alert("Error", "Please enter a title for this score.");
      return;
    }

    const totalPoints = getTotalPoints();
    if (totalPoints === 0) {
      Alert.alert("Error", "Cannot save a score with 0 points.");
      return;
    }

    try {
      await saveScore({
        title: saveTitle.trim(),
        eventType: 'womenHeptathlon',
        results: [...results],
        points: [...points],
        totalScore: totalPoints,
        resultScore: getResultScore(),
      });
      Alert.alert("Success", "Score saved successfully!");
      setShowSaveModal(false);
      setSaveTitle("");
    } catch (error) {
      Alert.alert("Error", "Failed to save score. Please try again.");
    }
  };

  const renderEventInput = (
    event: (typeof WOMEN_HEPTATHLON_EVENTS)[0],
    index: number
  ) => {
    let placeholderText = HEPTATHLON_PLACEHOLDERS[index];
    const maxLength = event.name === "800m" ? 7 : 5;
    return (
      <View key={index} style={styles.eventContainer}>
        <Text style={styles.eventName}>{event.name}</Text>
        <TextInput
          style={styles.input}
          value={results[index]}
          onChangeText={(text) => handleInputChange(text, index)}
          keyboardType="number-pad"
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

  const scrollContent = (
    <ScrollView
      style={styles.contentContainer}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Women's Heptathlon</Text>
      {WOMEN_HEPTATHLON_EVENTS.map((event, index) => (
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
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.chartButton}
          onPress={() => setShowChart(true)}
        >
          <Text style={styles.chartButtonText}>View Chart</Text>
        </TouchableOpacity>
        {Platform.OS !== 'web' && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => setShowSaveModal(true)}
          >
            <Text style={styles.saveButtonText}>Save Score</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.clearButton} onPress={clearAll}>
        <Text style={styles.clearButtonText}>Clear</Text>
      </TouchableOpacity>
      <View style={{ height: 60 }} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {Platform.OS === 'web' ? (
          scrollContent
        ) : (
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            style={{ flex: 1 }}
          >
            {scrollContent}
          </TouchableWithoutFeedback>
        )}
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
                  <Text style={styles.modalTitle}>Women's Heptathlon</Text>
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
      {/* Save Score Modal */}
      <Modal
        visible={showSaveModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowSaveModal(false);
          setSaveTitle("");
        }}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback
            onPress={() => {
              setShowSaveModal(false);
              setSaveTitle("");
            }}
          >
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View style={styles.saveModalContent}>
            <Text style={styles.saveModalTitle}>Save Score</Text>
            <Text style={styles.saveModalSubtitle}>
              Enter a title for this score
            </Text>
            <TextInput
              style={styles.saveModalInput}
              value={saveTitle}
              onChangeText={setSaveTitle}
              placeholder="e.g., My Personal Best"
              placeholderTextColor="#888"
              autoFocus={true}
              maxLength={50}
            />
            <View style={styles.saveModalButtons}>
              <TouchableOpacity
                style={[styles.saveModalButton, styles.saveModalButtonCancel]}
                onPress={() => {
                  setShowSaveModal(false);
                  setSaveTitle("");
                }}
              >
                <Text style={styles.saveModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveModalButton, styles.saveModalButtonSave]}
                onPress={handleSaveScore}
              >
                <Text style={styles.saveModalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
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
    ...Platform.select({
      web: {
        alignItems: "center",
      },
    }),
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 10,
    ...Platform.select({
      web: {
        maxWidth: 700,
        alignSelf: "center",
        width: "100%",
      },
    }),
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginVertical: 8,
  },
  chartButton: {
    backgroundColor: "#222",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: TRACK_COLOR,
    flex: 1,
    minWidth: 140,
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
  saveButton: {
    backgroundColor: "#222",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: TRACK_COLOR,
    flex: 1,
    minWidth: 140,
  },
  saveButtonText: {
    color: TRACK_COLOR,
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
  saveModalContent: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 20,
    width: "85%",
    maxWidth: 400,
    alignSelf: "center",
  },
  saveModalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  saveModalSubtitle: {
    fontSize: 14,
    color: "#bbb",
    marginBottom: 16,
    textAlign: "center",
  },
  saveModalInput: {
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  saveModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  saveModalButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  saveModalButtonCancel: {
    backgroundColor: "#333",
  },
  saveModalButtonSave: {
    backgroundColor: TRACK_COLOR,
  },
  saveModalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
