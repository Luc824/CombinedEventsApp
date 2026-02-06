import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { ThemeColors } from "../constants/ThemeColors";
import CalculatorTitleRow from "../components/calculators/CalculatorTitleRow";
import EventInputRow from "../components/calculators/EventInputRow";
import TotalScoreCard from "../components/calculators/TotalScoreCard";
import ActionButtonsRow from "../components/calculators/ActionButtonsRow";
import ClearButton from "../components/calculators/ClearButton";
import ChartModal from "../components/calculators/ChartModal";
import SaveScoreModal from "../components/calculators/SaveScoreModal";
import { worldAthleticsScores } from "../data/worldAthleticsScores";
import { saveScore } from "../utils/scoreStorage";
import { convertTimeToSeconds } from "../utils/timeUtils";

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

export default function WomenHeptathlonScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
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
    const placeholderText = HEPTATHLON_PLACEHOLDERS[index];
    const maxLength = event.name === "800m" ? 7 : 5;
    return (
      <EventInputRow
        key={index}
        eventName={event.name}
        value={results[index]}
        onChangeText={(text) => handleInputChange(text, index)}
        placeholder={placeholderText}
        maxLength={maxLength}
        points={points[index]}
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
      <CalculatorTitleRow
        title="Women's Heptathlon"
        onBack={() => router.back()}
        textColor={colors.text}
        buttonBackground={colors.surfaceSolid}
        buttonBorder={colors.border}
      />
      {WOMEN_HEPTATHLON_EVENTS.map((event, index) => (
        <React.Fragment key={index}>
          {renderEventInput(event, index)}
          {index === 3 && (
            <>
              <View style={{ height: 6 }} />
              <Text style={[styles.inlineDayTotalText, { color: colors.textSecondary }]}>
                Day 1: {getDay1Total()} Points
              </Text>
              <View style={{ height: 10 }} />
            </>
          )}
          {index === 6 && (
            <>
              <View style={{ height: 6 }} />
              <Text style={[styles.inlineDayTotalText, { color: colors.textSecondary }]}>
                Day 2: {getDay2Total()} Points
              </Text>
              <View style={{ height: 10 }} />
            </>
          )}
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
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
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
      <ChartModal
        visible={showChart}
        onClose={() => setShowChart(false)}
        title="Women's Heptathlon"
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
