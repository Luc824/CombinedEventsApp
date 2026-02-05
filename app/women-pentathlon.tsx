import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
  View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { ThemeColors } from "../constants/ThemeColors";
import { worldAthleticsScores } from "../data/worldAthleticsScores";
import { saveScore } from "../utils/scoreStorage";

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

// Event labels for chart display (abbreviated)
const EVENT_LABELS = [
  "60H",
  "HJ",
  "SP",
  "LJ",
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

export default function WomenPentathlonScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
  const [results, setResults] = useState<string[]>(Array(5).fill(""));
  const [points, setPoints] = useState<number[]>(Array(5).fill(0));
  const [showChart, setShowChart] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");

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
        eventType: 'womenPentathlon',
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
    event: (typeof WOMEN_PENTATHLON_EVENTS)[0],
    index: number
  ) => {
    let placeholderText = PENTATHLON_PLACEHOLDERS[index];
    const maxLength = event.name === "800m" ? 7 : 5;
    return (
      <View key={index} style={[styles.eventContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.eventName, { color: colors.text }]}>{event.name}</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderWidth: 1, borderColor: colors.inputBorder || colors.border }]}
          value={results[index]}
          onChangeText={(text) => handleInputChange(text, index)}
          keyboardType="number-pad"
          placeholder={placeholderText}
          placeholderTextColor={colors.textMuted}
          maxLength={maxLength}
        />
        <Text style={[styles.points, { color: colors.text }]}>{points[index]} Points</Text>
      </View>
    );
  };

  const renderBarChart = () => {
    const maxPoints = Math.max(...points, 1000); // Minimum scale of 1000
    const chartHeight = 200;
    const barWidth = 22;
    const barSpacing = 4;

    return (
      <View style={[styles.chartContainer, { backgroundColor: colors.surfaceSolid }]}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>Performance Overview</Text>
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
                <Text style={[styles.barValue, { color: colors.text }]}>{pointValue}</Text>
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
                  <Text style={[styles.barLabel, { color: colors.text }]} numberOfLines={1}>
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
      <View style={styles.titleRow}>
        {Platform.OS !== 'web' && (
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: colors.surfaceSolid, borderColor: colors.border }]} 
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </TouchableOpacity>
        )}
        <Text style={[styles.title, { color: colors.text }]}>Women's Pentathlon</Text>
      </View>
      {WOMEN_PENTATHLON_EVENTS.map((event, index) => (
        <React.Fragment key={index}>
          {renderEventInput(event, index)}
        </React.Fragment>
      ))}
      <View style={[styles.totalContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.totalText, { color: colors.text }]}>
          Total Score: {getTotalPoints()} Points
        </Text>
        <Text style={[styles.resultScoreText, { color: TRACK_COLOR }]}>
          Result Score: {getResultScore()}
        </Text>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.chartButton, { backgroundColor: colors.buttonPrimary }]}
          onPress={() => setShowChart(true)}
        >
          <Text style={[styles.chartButtonText, { color: colors.buttonText }]}>View Chart</Text>
        </TouchableOpacity>
        {Platform.OS !== 'web' && (
          <TouchableOpacity
            style={[styles.saveButton, { backgroundColor: colors.buttonPrimary }]}
            onPress={() => setShowSaveModal(true)}
          >
            <Text style={[styles.saveButtonText, { color: colors.buttonText }]}>Save Score</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={[styles.clearButton, { backgroundColor: colors.buttonSecondary }]} onPress={clearAll}>
        <Text style={[styles.clearButtonText, { color: colors.buttonText }]}>Clear</Text>
      </TouchableOpacity>
      <View style={{ height: 20 }} />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: colors.background }]}
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
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <TouchableWithoutFeedback onPress={() => setShowChart(false)}>
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContentWrapper}>
            <ScrollView
              contentContainerStyle={styles.modalScrollContent}
              style={styles.modalScrollView}
            >
              <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
                <View style={styles.modalHeader}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>Women's Pentathlon</Text>
                  <TouchableOpacity
                    onPress={() => setShowChart(false)}
                    style={[styles.closeButton, { backgroundColor: colors.surfaceSolid }]}
                  >
                    <Text style={[styles.closeButtonText, { color: colors.text }]}>✕</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.totalScoreCard, { backgroundColor: colors.surfaceSolid }]}>
                  <Text style={[styles.totalScoreLabel, { color: colors.textSecondary }]}>Total Score</Text>
                  <Text style={[styles.totalScoreValue, { color: colors.text }]}>
                    {getTotalPoints()}
                  </Text>
                  <Text style={[styles.totalScoreUnit, { color: colors.text }]}>Points</Text>
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
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
          <TouchableWithoutFeedback
            onPress={() => {
              setShowSaveModal(false);
              setSaveTitle("");
            }}
          >
            <View style={StyleSheet.absoluteFill} />
          </TouchableWithoutFeedback>
          <View style={[styles.saveModalContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.saveModalTitle, { color: colors.text }]}>Save Score</Text>
            <Text style={[styles.saveModalSubtitle, { color: colors.textSecondary }]}>
              Enter a title for this score
            </Text>
            <TextInput
              style={[styles.saveModalInput, { backgroundColor: colors.inputBackground, color: colors.inputText, borderColor: colors.border }]}
              value={saveTitle}
              onChangeText={setSaveTitle}
              placeholder="e.g., My Personal Best"
              placeholderTextColor={colors.textMuted}
              autoFocus={true}
              maxLength={50}
            />
            <View style={styles.saveModalButtons}>
              <TouchableOpacity
                style={[styles.saveModalButton, styles.saveModalButtonCancel, { backgroundColor: colors.buttonSecondary }]}
                onPress={() => {
                  setShowSaveModal(false);
                  setSaveTitle("");
                }}
              >
                <Text style={[styles.saveModalButtonText, { color: colors.buttonText }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveModalButton, styles.saveModalButtonSave, { backgroundColor: colors.buttonPrimary }]}
                onPress={handleSaveScore}
              >
                <Text style={[styles.saveModalButtonText, { color: colors.buttonText }]}>Save</Text>
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
  titleRow: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 12,
    position: "relative",
    paddingLeft: 50,
    paddingRight: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    position: "absolute",
    left: 0,
    zIndex: 1,
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    width: "100%",
  },
  eventContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
    marginHorizontal: 16,
    backgroundColor: "rgba(34, 34, 34, 0.6)",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 5,
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
    marginTop: 8,
    alignItems: "center",
    paddingVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "rgba(34, 34, 34, 0.6)",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 10,
    marginBottom: 12,
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
    backgroundColor: "#444",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  chartButton: {
    backgroundColor: TRACK_COLOR,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minWidth: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
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
    backgroundColor: TRACK_COLOR,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minWidth: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
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
