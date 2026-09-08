import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EventInputRow from "../components/calculators/EventInputRow";
import TotalScoreCard from "../components/calculators/TotalScoreCard";
import KeyboardDismissScrollView from "../components/KeyboardDismissScrollView";
import { ThemeColors } from "../constants/ThemeColors";
import { USE_NATIVE_HEADER } from "../constants/navigation";
import { actionButtonStyle, buttonElevation, formFieldStyle } from "../constants/ui";
import { useTheme } from "../contexts/ThemeContext";
import {
  CALCULATOR_CONFIGS,
  calculateEventPoints,
  getEventInverseConfig,
  getResultScoreForTotal,
  pointsInputsFromSaved,
} from "../utils/calculatorConfigs";
import {
  createCommitPointsChange,
  createHandleInputChange,
  createHandlePointsTextChange,
} from "../utils/calculatorRowHandlers";
import { closestPerformanceFromPoints } from "../utils/performanceFromPoints";
import { validateScoreForSave } from "../utils/pointsUtils";
import {
  EventType,
  SavedScoresStorageError,
  getEventTypeDisplayName,
  getSavedScoreById,
  updateScore,
} from "../utils/scoreStorage";
import { scaleFont, scaleSpacing } from "../utils/uiScale";

const TRACK_COLOR = "#D35400";

export default function EditSavedScoreScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
  const params = useLocalSearchParams<{ id: string }>();
  const scoreId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [title, setTitle] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [points, setPoints] = useState<number[]>([]);
  const [pointsInputs, setPointsInputs] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const loadScore = useCallback(async () => {
    if (!scoreId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const score = await getSavedScoreById(scoreId);
      if (!score) {
        setEventType(null);
        return;
      }

      setEventType(score.eventType);
      setTitle(score.title);
      setResults([...score.results]);
      setPoints([...score.points]);
      setPointsInputs(pointsInputsFromSaved(score.points));
    } catch {
      Alert.alert("Error", "Failed to load saved score.");
    } finally {
      setLoading(false);
    }
  }, [scoreId]);

  useEffect(() => {
    loadScore();
  }, [loadScore]);

  const config = eventType ? CALCULATOR_CONFIGS[eventType] : null;

  const calculatePoints = useCallback(
    (value: string, index: number) => {
      if (!config) {
        return 0;
      }
      return calculateEventPoints(value, index, config);
    },
    [config]
  );

  const handleInputChange = config
    ? createHandleInputChange({
        results,
        points,
        setResults,
        setPoints,
        setPointsInputs,
        getEventName: (index) => config.events[index].name,
        trackEvents: config.trackEvents,
        longTrackEvents: config.longTrackEvents,
        calculatePoints,
      })
    : () => {};

  const handlePointsTextChange = createHandlePointsTextChange({
    setPointsInputs,
  });

  const commitPointsChange = config
    ? createCommitPointsChange({
        results,
        points,
        pointsInputs,
        setResults,
        setPoints,
        setPointsInputs,
        getInverseConfig: (index) => getEventInverseConfig(index, config),
      })
    : () => {};

  const getTotalPoints = () => points.reduce((sum, point) => sum + point, 0);

  const buildFinalScoreState = () => {
    if (!config) {
      return { finalResults: results, finalPoints: points };
    }

    const finalResults = [...results];
    const finalPoints = [...points];

    for (let index = 0; index < config.events.length; index++) {
      const digits = pointsInputs[index];
      if (!digits) {
        continue;
      }

      const targetPoints = parseInt(digits, 10);
      if (!targetPoints) {
        finalResults[index] = "";
        finalPoints[index] = 0;
        continue;
      }

      const match = closestPerformanceFromPoints(
        targetPoints,
        getEventInverseConfig(index, config)
      );
      if (match) {
        finalResults[index] = match.performance;
        finalPoints[index] = match.actualPoints;
      }
    }

    return { finalResults, finalPoints };
  };

  const getResultScore = (totalPoints: number) => {
    if (!eventType) {
      return "0";
    }
    return getResultScoreForTotal(eventType, totalPoints);
  };

  const handleSave = async () => {
    if (!scoreId || !eventType || !config) {
      return;
    }

    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for this score.");
      return;
    }

    const { finalResults, finalPoints } = buildFinalScoreState();
    const totalPoints = finalPoints.reduce((sum, point) => sum + point, 0);
    const validationError = validateScoreForSave(
      finalResults,
      finalPoints,
      totalPoints
    );
    if (validationError) {
      Alert.alert("Error", validationError);
      return;
    }

    try {
      setSaving(true);
      await updateScore(scoreId, {
        title: title.trim(),
        results: finalResults,
        points: finalPoints,
        totalScore: totalPoints,
        resultScore: getResultScore(totalPoints),
      });
      router.back();
    } catch (error) {
      const message =
        error instanceof SavedScoresStorageError
          ? error.message
          : "Failed to update score.";
      Alert.alert("Error", message);
    } finally {
      setSaving(false);
    }
  };

  const screenTitle = title.trim() || "Edit Score";

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "Edit Score" }} />
        <SafeAreaView
          style={[styles.safeArea, { backgroundColor: colors.background }]}
          edges={USE_NATIVE_HEADER ? ["bottom"] : ["top", "bottom", "left", "right"]}
        >
          <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
          <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.messageText, { color: colors.text }]}>Loading...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (!eventType || !config) {
    return (
      <>
        <Stack.Screen options={{ title: "Edit Score" }} />
        <SafeAreaView
          style={[styles.safeArea, { backgroundColor: colors.background }]}
          edges={USE_NATIVE_HEADER ? ["bottom"] : ["top", "bottom", "left", "right"]}
        >
          <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
          <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.messageText, { color: colors.text }]}>Score not found</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  const scrollContent = (
    <KeyboardDismissScrollView contentContainerStyle={styles.scrollContent}>
      <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Score Title</Text>
      <TextInput
        style={[
          styles.titleInput,
          formFieldStyle,
          {
            backgroundColor: colors.inputBackground,
            color: colors.inputText,
            borderColor: colors.inputBorder || colors.border,
          },
        ]}
        value={title}
        onChangeText={setTitle}
        placeholder="e.g., My Personal Best"
        placeholderTextColor={colors.textMuted}
        maxLength={50}
        selectTextOnFocus
        autoCorrect={false}
        spellCheck={false}
      />

      <Text style={[styles.eventTypeLabel, { color: TRACK_COLOR }]}>
        {getEventTypeDisplayName(eventType)}
      </Text>

      {config.events.map((event, index) => {
        const maxLength = config.longTrackEvents.includes(event.name) ? 7 : 5;
        return (
          <EventInputRow
            key={index}
            eventName={event.name}
            value={results[index] ?? ""}
            onChangeText={(text) => handleInputChange(text, index)}
            pointsValue={pointsInputs[index] ?? ""}
            onPointsChange={(text) => handlePointsTextChange(text, index)}
            onPointsBlur={() => commitPointsChange(index)}
            placeholder={config.placeholders[index]}
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
      })}

      <TotalScoreCard
        totalScore={getTotalPoints()}
        resultScore={getResultScore(getTotalPoints())}
        textColor={colors.text}
        trackColor={TRACK_COLOR}
        backgroundColor={colors.surface}
        borderColor={colors.border}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            actionButtonStyle,
            buttonElevation(),
            { backgroundColor: colors.buttonSecondary },
          ]}
          onPress={() => router.back()}
          disabled={saving}
        >
          <Text style={[styles.actionButtonText, { color: colors.buttonText }]}>
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.actionButton,
            actionButtonStyle,
            buttonElevation(),
            { backgroundColor: colors.buttonPrimary },
            saving && styles.actionButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={[styles.actionButtonText, { color: colors.buttonText }]}>
            {saving ? "Saving..." : "Save Changes"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ height: scaleSpacing(20) }} />
    </KeyboardDismissScrollView>
  );

  return (
    <>
      <Stack.Screen options={{ title: screenTitle }} />
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={USE_NATIVE_HEADER ? ["bottom"] : ["top", "bottom", "left", "right"]}
      >
        <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          {scrollContent}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    ...Platform.select({
      web: {
        alignItems: "center",
      },
    }),
  },
  container: {
    flex: 1,
    paddingHorizontal: scaleSpacing(10),
    ...Platform.select({
      web: {
        maxWidth: 700,
        alignSelf: "center",
        width: "100%",
      },
    }),
  },
  scrollContent: {
    paddingTop: scaleSpacing(10),
  },
  messageText: {
    fontSize: scaleFont(18),
    textAlign: "center",
    marginTop: scaleSpacing(50),
  },
  sectionLabel: {
    fontSize: scaleFont(14),
    fontWeight: "600",
    marginBottom: scaleSpacing(6),
    marginHorizontal: scaleSpacing(16),
  },
  titleInput: {
    marginBottom: scaleSpacing(16),
    marginHorizontal: scaleSpacing(16),
    textAlign: "left",
    ...Platform.select({
      web: {
        outlineStyle: "none" as any,
      },
    }),
  },
  eventTypeLabel: {
    fontSize: scaleFont(16),
    fontWeight: "700",
    marginBottom: scaleSpacing(8),
    marginHorizontal: scaleSpacing(16),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scaleSpacing(10),
    marginTop: scaleSpacing(8),
    marginHorizontal: scaleSpacing(16),
  },
  actionButton: {
    flex: 1,
  },
  actionButtonDisabled: {
    opacity: 0.7,
  },
  actionButtonText: {
    fontWeight: "600",
    fontSize: scaleFont(15),
  },
});
