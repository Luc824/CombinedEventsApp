import React, { useState } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionButtonsRow from "../components/calculators/ActionButtonsRow";
import CalculatorTitleRow from "../components/calculators/CalculatorTitleRow";
import ChartModal from "../components/calculators/ChartModal";
import ClearButton from "../components/calculators/ClearButton";
import EventInputRow from "../components/calculators/EventInputRow";
import SaveScoreModal from "../components/calculators/SaveScoreModal";
import TotalScoreCard from "../components/calculators/TotalScoreCard";
import { ThemeColors } from "../constants/ThemeColors";
import { USE_NATIVE_HEADER } from "../constants/navigation";
import { useTheme } from "../contexts/ThemeContext";
import { worldAthleticsScores } from "../data/worldAthleticsScores";
import { saveScore } from "../utils/scoreStorage";
import { getStandardInverseConfig } from "../utils/calculatorInverseConfig";
import {
  createCommitPointsChange,
  createEmptyPointsInputs,
  createHandleInputChange,
  createHandlePointsTextChange,
} from "../utils/calculatorRowHandlers";
import { convertTimeToSeconds } from "../utils/timeUtils";
import {
  safeFloorPoints,
  shouldCalculatePoints,
  validateScoreForSave,
} from "../utils/pointsUtils";

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

const TRACK_EVENTS = ["60m Hurdles", "800m"];
const LONG_TRACK_EVENTS = ["800m"];

// Event labels for chart display (abbreviated)
const EVENT_LABELS = [
  "60H",
  "HJ",
  "SP",
  "LJ",
  "800m",
];

export default function WomenPentathlonScreen() {
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
  const [results, setResults] = useState<string[]>(Array(5).fill(""));
  const [points, setPoints] = useState<number[]>(Array(5).fill(0));
  const [pointsInputs, setPointsInputs] = useState<string[]>(
    createEmptyPointsInputs(5)
  );
  const [showChart, setShowChart] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveTitle, setSaveTitle] = useState("");

  const calculatePoints = (value: string, index: number) => {
    if (!value) return 0;
    const event = WOMEN_PENTATHLON_EVENTS[index];
    const isTrack = TRACK_EVENTS.includes(event.name);
    const isLongTrack = LONG_TRACK_EVENTS.includes(event.name);
    if (!shouldCalculatePoints(value, isTrack, isLongTrack)) return 0;
    let inputValue = parseFloat(value);
    try {
      if (event.name === "800m") {
        inputValue = convertTimeToSeconds(value);
      } else if (event.name === "High Jump" || event.name === "Long Jump") {
        inputValue = parseFloat(value) * 100;
      }
      return safeFloorPoints(event.formula(inputValue));
    } catch {
      return 0;
    }
  };

  const handleInputChange = createHandleInputChange({
    results,
    points,
    setResults,
    setPoints,
    setPointsInputs,
    getEventName: (index) => WOMEN_PENTATHLON_EVENTS[index].name,
    trackEvents: TRACK_EVENTS,
    longTrackEvents: LONG_TRACK_EVENTS,
    calculatePoints,
  });

  const handlePointsTextChange = createHandlePointsTextChange({
    setPointsInputs,
  });

  const commitPointsChange = createCommitPointsChange({
    results,
    points,
    pointsInputs,
    setResults,
    setPoints,
    setPointsInputs,
    getInverseConfig: (index) =>
      getStandardInverseConfig(
        WOMEN_PENTATHLON_EVENTS[index].name,
        WOMEN_PENTATHLON_EVENTS[index].formula,
        TRACK_EVENTS,
        LONG_TRACK_EVENTS,
        true
      ),
  });

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
    setPointsInputs(createEmptyPointsInputs(5));
  };

  const handleSaveScore = async () => {
    if (!saveTitle.trim()) {
      Alert.alert("Error", "Please enter a title for this score.");
      return;
    }

    const totalPoints = getTotalPoints();
    const validationError = validateScoreForSave(results, points, totalPoints);
    if (validationError) {
      Alert.alert("Error", validationError);
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
    } catch {
      Alert.alert("Error", "Failed to save score. Please try again.");
    }
  };

  const renderEventInput = (
    event: (typeof WOMEN_PENTATHLON_EVENTS)[0],
    index: number
  ) => {
    const placeholderText = PENTATHLON_PLACEHOLDERS[index];
    const maxLength = event.name === "800m" ? 7 : 5;
    return (
      <EventInputRow
        key={index}
        eventName={event.name}
        value={results[index]}
        onChangeText={(text) => handleInputChange(text, index)}
        pointsValue={pointsInputs[index]}
        onPointsChange={(text) => handlePointsTextChange(text, index)}
        onPointsBlur={() => commitPointsChange(index)}
        placeholder={placeholderText}
        maxLength={maxLength}
        textColor={colors.text}
        inputBackground={colors.inputBackground}
        inputText={colors.inputText}
        inputBorder={colors.inputBorder || colors.border}
        containerBackground={colors.surface}
        containerBorder={colors.border}
        placeholderColor={colors.textMuted}
      />
    );
  };

  const scrollContent = (
    <ScrollView
      style={styles.contentContainer}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {!USE_NATIVE_HEADER && (
        <CalculatorTitleRow
          title="Women's Pentathlon"
          onBack={() => {}}
          textColor={colors.text}
          buttonBackground={colors.surfaceSolid}
          buttonBorder={colors.border}
        />
      )}
      {WOMEN_PENTATHLON_EVENTS.map((event, index) => (
        <React.Fragment key={index}>
          {renderEventInput(event, index)}
        </React.Fragment>
      ))}
      <TotalScoreCard
        totalScore={getTotalPoints()}
        resultScore={getResultScore()}
        textColor={colors.text}
        trackColor={TRACK_COLOR}
        backgroundColor={colors.surface}
        borderColor={colors.border}
      />
      <ActionButtonsRow
        onViewChart={() => setShowChart(true)}
        onSaveScore={() => setShowSaveModal(true)}
        buttonBackground={colors.buttonPrimary}
        buttonTextColor={colors.buttonText}
      />
      <ClearButton
        onPress={clearAll}
        backgroundColor={colors.buttonSecondary}
        textColor={colors.buttonText}
      />
      <View style={{ height: 20 }} />
    </ScrollView>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={USE_NATIVE_HEADER ? ["bottom"] : ["top", "bottom", "left", "right"]}
    >
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {Platform.OS === 'web' ? (
          scrollContent
        ) : (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.dismissArea}>{scrollContent}</View>
          </TouchableWithoutFeedback>
        )}
      </KeyboardAvoidingView>
      <ChartModal
        visible={showChart}
        onClose={() => setShowChart(false)}
        title="Women's Pentathlon"
        totalPoints={getTotalPoints()}
        points={points}
        eventLabels={EVENT_LABELS}
        trackColor={TRACK_COLOR}
        textColor={colors.text}
        secondaryTextColor={colors.textSecondary}
        backgroundColor={colors.cardBackground}
        surfaceColor={colors.surfaceSolid}
        overlayColor={colors.modalOverlay}
        barLabelContainerHeight={20}
        barLabelFontSize={10}
      />
      {/* Save Score Modal */}
      <SaveScoreModal
        visible={showSaveModal}
        onClose={() => {
          setShowSaveModal(false);
          setSaveTitle("");
        }}
        onSave={handleSaveScore}
        title={saveTitle}
        setTitle={setSaveTitle}
        backgroundColor={colors.cardBackground}
        overlayColor={colors.modalOverlay}
        textColor={colors.text}
        secondaryTextColor={colors.textSecondary}
        placeholderColor={colors.textMuted}
        inputBackground={colors.inputBackground}
        inputText={colors.inputText}
        inputBorder={colors.border}
        primaryButtonColor={colors.buttonPrimary}
        secondaryButtonColor={colors.buttonSecondary}
        buttonTextColor={colors.buttonText}
      />
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
  dismissArea: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  inlineDayTotalText: {
    color: "#bbb",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 2,
  },
});
