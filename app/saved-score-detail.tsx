import { Stack, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChartModal from "../components/calculators/ChartModal";
import { ThemeColors } from "../constants/ThemeColors";
import { USE_NATIVE_HEADER } from "../constants/navigation";
import { Radius, actionButtonStyle, buttonElevation } from "../constants/ui";
import { useTheme } from "../contexts/ThemeContext";
import {
  EventType,
  SavedScore,
  getEventNames,
  getEventChartLabels,
  getEventTypeDisplayName,
  getSavedScoreById,
} from "../utils/scoreStorage";
import { scaleFont, scaleSpacing } from "../utils/uiScale";
import { useSafePush } from "../utils/useSafePush";

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
  const safePush = useSafePush();
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
  const [showChart, setShowChart] = useState(false);
  const [score, setScore] = useState<SavedScore | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useLocalSearchParams<{ id: string }>();
  const scoreId = Array.isArray(params.id) ? params.id[0] : params.id;

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      async function loadScore() {
        if (!scoreId) {
          if (!cancelled) {
            setScore(null);
            setLoading(false);
          }
          return;
        }

        try {
          if (!cancelled) {
            setLoading(true);
          }
          const loadedScore = await getSavedScoreById(scoreId);
          if (!cancelled) {
            setScore(loadedScore);
          }
        } catch (error) {
          console.error("Error loading score:", error);
          if (!cancelled) {
            setScore(null);
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      }

      loadScore();
      return () => {
        cancelled = true;
      };
    }, [scoreId])
  );

  const screenTitle = score?.title ?? "Saved Score";

  if (loading) {
    return (
      <>
        <Stack.Screen options={{ title: "Saved Score" }} />
        <SafeAreaView
          style={[styles.safeArea, { backgroundColor: colors.background }]}
          edges={USE_NATIVE_HEADER ? ["bottom"] : ["top", "bottom", "left", "right"]}
        >
          <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
          <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text style={[styles.errorText, { color: colors.text }]}>Loading...</Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

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

  const handleShare = async () => {
    const lines = [
      score.title,
      chartTitle,
      `Total: ${score.totalScore} points`,
      `Result score: ${score.resultScore}`,
      "",
      ...eventNames.map((name, index) => {
        const result = score.results[index] || "—";
        const pts = score.points[index] ?? 0;
        return `${name}: ${result} (${pts} pts)`;
      }),
    ];
    try {
      await Share.share({ message: lines.join("\n") });
    } catch {
      Alert.alert("Error", "Could not share this score.");
    }
  };

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
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    actionButtonStyle,
                    buttonElevation(),
                    { backgroundColor: colors.buttonPrimary },
                  ]}
                  onPress={() => setShowChart(true)}
                >
                  <Text style={[styles.actionButtonText, { color: colors.buttonText }]}>
                    View Chart
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    actionButtonStyle,
                    buttonElevation(),
                    { backgroundColor: colors.buttonPrimary },
                  ]}
                  onPress={() =>
                    safePush({
                      pathname: "/edit-saved-score",
                      params: { id: score.id },
                    } as any)
                  }
                >
                  <Text style={[styles.actionButtonText, { color: colors.buttonText }]}>
                    Edit Score
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  styles.shareButton,
                  actionButtonStyle,
                  buttonElevation(),
                  { backgroundColor: colors.buttonPrimary },
                ]}
                onPress={handleShare}
              >
                <Text style={[styles.actionButtonText, { color: colors.buttonText }]}>
                  Share
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Event Performances</Text>
            <View
              style={[
                styles.eventsList,
                {
                  backgroundColor: colors.surfaceSolid,
                  borderColor: colors.border,
                },
              ]}
            >
              {eventNames.map((eventName, index) => {
                const result = score.results[index]?.trim();
                const points = score.points[index] ?? 0;
                return (
                  <View
                    key={index}
                    style={[
                      styles.eventRow,
                      index < eventNames.length - 1 && {
                        borderBottomWidth: StyleSheet.hairlineWidth,
                        borderBottomColor: colors.border,
                      },
                    ]}
                  >
                    <Text
                      style={[styles.eventName, { color: colors.textSecondary }]}
                      numberOfLines={2}
                    >
                      {eventName}
                    </Text>
                    <Text
                      style={[styles.eventResult, { color: colors.text }]}
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      minimumFontScale={0.75}
                    >
                      {result || "—"}
                    </Text>
                    <View style={styles.pointsWrap}>
                      <Text style={[styles.eventPoints, { color: TRACK_COLOR }]}>
                        {points}
                      </Text>
                      <Text style={[styles.pointsSuffix, { color: colors.textSecondary }]}>
                        pts
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
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
    fontSize: scaleFont(17),
    fontWeight: "600",
    marginBottom: scaleSpacing(10),
  },
  chartButtonSpacer: {
    marginBottom: scaleSpacing(16),
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scaleSpacing(10),
  },
  actionButton: {
    flex: 1,
    minHeight: scaleSpacing(44),
  },
  shareButton: {
    width: "100%",
    minHeight: scaleSpacing(44),
    marginTop: scaleSpacing(10),
  },
  actionButtonText: {
    fontWeight: "600",
    fontSize: scaleFont(15),
    textAlign: "center",
  },
  eventsList: {
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: "hidden",
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: scaleSpacing(10),
    paddingHorizontal: scaleSpacing(12),
    gap: scaleSpacing(8),
  },
  eventName: {
    flex: 1.1,
    fontSize: scaleFont(13),
    fontWeight: "500",
    lineHeight: scaleFont(16),
  },
  eventResult: {
    flex: 1,
    fontSize: scaleFont(17),
    fontWeight: "700",
    textAlign: "right",
  },
  pointsWrap: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-end",
    minWidth: scaleSpacing(58),
    gap: scaleSpacing(3),
  },
  eventPoints: {
    fontSize: scaleFont(16),
    fontWeight: "700",
    textAlign: "right",
  },
  pointsSuffix: {
    fontSize: scaleFont(11),
    fontWeight: "600",
  },
});
