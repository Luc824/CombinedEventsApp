import { Stack, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActionButtonsRow from "../components/calculators/ActionButtonsRow";
import ChartModal from "../components/calculators/ChartModal";
import { ThemeColors } from "../constants/ThemeColors";
import { USE_NATIVE_HEADER } from "../constants/navigation";
import { Radius } from "../constants/ui";
import { useTheme } from "../contexts/ThemeContext";
import {
  EventType,
  SavedScore,
  getEventNames,
  getEventChartLabels,
  getEventTypeDisplayName,
} from "../utils/scoreStorage";
import { scaleFont, scaleSpacing } from "../utils/uiScale";

const TRACK_COLOR = "#D35400";

const CHART_CONFIG: Record<
  EventType,
  {
    barLabelContainerHeight: number;
    barLabelFontSize: number;
    barLabelSmallFontSize?: number;
    longLabelLength?: number;
  }
> = {
  decathlon: {
    barLabelContainerHeight: 22,
    barLabelFontSize: 9,
    barLabelSmallFontSize: 8,
    longLabelLength: 4,
  },
  menHeptathlon: {
    barLabelContainerHeight: 22,
    barLabelFontSize: 9,
    barLabelSmallFontSize: 8,
    longLabelLength: 4,
  },
  womenHeptathlon: {
    barLabelContainerHeight: 20,
    barLabelFontSize: 10,
  },
  womenPentathlon: {
    barLabelContainerHeight: 20,
    barLabelFontSize: 10,
  },
};

export default function SavedScoreDetailScreen() {
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
  const [showChart, setShowChart] = useState(false);
  const params = useLocalSearchParams<{ score: string }>();
  
  let score: SavedScore | null = null;
  try {
    score = params.score ? JSON.parse(params.score) : null;
  } catch (error) {
    console.error("Error parsing score:", error);
  }

  const screenTitle = score?.title ?? "Saved Score";

  if (!score) {
    return (
      <>
        <Stack.Screen options={{ title: "Saved Score" }} />
        <SafeAreaView
          style={[styles.safeArea, { backgroundColor: colors.background }]}
          edges={USE_NATIVE_HEADER ? ["bottom"] : ["top", "bottom", "left", "right"]}
        >
          <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
          <View style={[styles.container, { backgroundColor: colors.background }]}>
            {!USE_NATIVE_HEADER && (
              <View style={styles.titleRow}>
                <Text style={[styles.title, { color: colors.text }]}>Saved Score</Text>
              </View>
            )}
            <Text style={[styles.errorText, { color: colors.text }]}>Score not found</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  const eventNames = getEventNames(score.eventType);
  const chartLabels = getEventChartLabels(score.eventType);
  const chartTitle = getEventTypeDisplayName(score.eventType);
  const chartConfig = CHART_CONFIG[score.eventType];

  return (
    <>
      <Stack.Screen options={{ title: screenTitle }} />
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: colors.background }]}
        edges={USE_NATIVE_HEADER ? ["bottom"] : ["top", "bottom", "left", "right"]}
      >
        <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {!USE_NATIVE_HEADER && (
            <View style={styles.titleRow}>
              <Text style={[styles.title, { color: colors.text }]}>{score.title}</Text>
            </View>
          )}

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.summaryCard, { backgroundColor: colors.surfaceSolid, borderWidth: 1, borderColor: colors.border }]}>
              <Text style={[styles.eventType, { color: TRACK_COLOR }]}>{chartTitle}</Text>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Score:</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{score.totalScore} Points</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Result Score:</Text>
                <Text style={[styles.resultScoreValue, { color: TRACK_COLOR }]}>{score.resultScore}</Text>
              </View>
            </View>

            <View style={styles.chartButtonSpacer}>
              <ActionButtonsRow
                onViewChart={() => setShowChart(true)}
                onSaveScore={() => {}}
                showSaveButton={false}
                buttonBackground={colors.buttonPrimary}
                buttonTextColor={colors.buttonText}
              />
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Event Performances</Text>
            {eventNames.map((eventName, index) => (
              <View key={index} style={[styles.eventCard, { backgroundColor: colors.surfaceSolid, borderWidth: 1, borderColor: colors.border }]}>
                <View style={styles.eventHeader}>
                  <Text style={[styles.eventName, { color: colors.text }]}>{eventName}</Text>
                  <Text style={[styles.eventPoints, { color: TRACK_COLOR }]}>{score.points[index]} Points</Text>
                </View>
                <Text style={[styles.eventResult, { color: colors.textSecondary }]}>
                  {score.results[index] || "No result"}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
        <ChartModal
          visible={showChart}
          onClose={() => setShowChart(false)}
          title={chartTitle}
          totalPoints={score.totalScore}
          points={score.points}
          eventLabels={chartLabels}
          trackColor={TRACK_COLOR}
          textColor={colors.text}
          secondaryTextColor={colors.textSecondary}
          backgroundColor={colors.cardBackground}
          surfaceColor={colors.surfaceSolid}
          overlayColor={colors.modalOverlay}
          barLabelContainerHeight={chartConfig.barLabelContainerHeight}
          barLabelFontSize={chartConfig.barLabelFontSize}
          barLabelSmallFontSize={chartConfig.barLabelSmallFontSize}
          longLabelLength={chartConfig.longLabelLength}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: scaleSpacing(20),
  },
  titleRow: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "android" ? scaleSpacing(26) : scaleSpacing(14),
    marginBottom: scaleSpacing(20),
  },
  title: {
    fontSize: scaleFont(28),
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  errorText: {
    fontSize: scaleFont(18),
    textAlign: "center",
    marginTop: scaleSpacing(50),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scaleSpacing(20),
  },
  summaryCard: {
    borderRadius: Radius.md,
    padding: scaleSpacing(16),
    marginBottom: scaleSpacing(24),
  },
  eventType: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    marginBottom: scaleSpacing(12),
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scaleSpacing(8),
  },
  summaryLabel: {
    fontSize: scaleFont(16),
  },
  summaryValue: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
  },
  resultScoreValue: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    marginBottom: scaleSpacing(12),
  },
  chartButtonSpacer: {
    marginBottom: scaleSpacing(16),
  },
  eventCard: {
    borderRadius: Radius.md,
    padding: scaleSpacing(16),
    marginBottom: scaleSpacing(12),
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scaleSpacing(8),
  },
  eventName: {
    fontSize: scaleFont(16),
    fontWeight: "600",
    flex: 1,
  },
  eventPoints: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    marginLeft: scaleSpacing(12),
  },
  eventResult: {
    fontSize: scaleFont(14),
  },
});
