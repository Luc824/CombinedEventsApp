import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import GlassCloseButton from "../components/GlassCloseButton";
import { ThemeColors } from "../constants/ThemeColors";
import { USE_NATIVE_HEADER } from "../constants/navigation";
import { Radius, ScreenLayout } from "../constants/ui";
import { useTheme } from "../contexts/ThemeContext";
import { deleteScore, getEventTypeDisplayName, getSavedScores, SavedScore } from "../utils/scoreStorage";
import { scaleFont, scaleSpacing } from "../utils/uiScale";

const TRACK_COLOR = "#D35400";

export default function SavedScoresScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
  const [scores, setScores] = useState<SavedScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScores();
  }, []);

  const loadScores = async () => {
    try {
      const savedScores = await getSavedScores();
      setScores(savedScores);
    } catch {
      Alert.alert("Error", "Failed to load saved scores.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      "Delete Score",
      `Are you sure you want to delete "${title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteScore(id);
              await loadScores();
            } catch {
              Alert.alert("Error", "Failed to delete score.");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>Loading...</Text>
        </View>
      );
    }

    if (scores.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>No saved scores yet</Text>
          <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
            Save scores from any calculator screen to see them here
          </Text>
        </View>
      );
    }

    return scores.map((score) => (
      <View key={score.id} style={styles.scoreCardWrapper}>
        <TouchableOpacity
          style={[styles.scoreCard, { backgroundColor: colors.surfaceSolid, borderWidth: 1, borderColor: colors.border }]}
          onPress={() =>
            router.push({
              pathname: "/saved-score-detail",
              params: { score: JSON.stringify(score) },
            } as any)
          }
          activeOpacity={0.7}
        >
          <View style={styles.scoreHeader}>
            <View style={styles.scoreTitleContainer}>
              <Text style={[styles.scoreTitle, { color: colors.text }]}>{score.title}</Text>
              <Text style={[styles.eventType, { color: TRACK_COLOR }]}>
                {getEventTypeDisplayName(score.eventType)}
              </Text>
            </View>
          </View>
          <View style={[styles.scoreDetails, { borderTopColor: colors.border }]}>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Total Score:</Text>
              <Text style={[styles.scoreValue, { color: colors.text }]}>{score.totalScore} Points</Text>
            </View>
            <View style={styles.scoreRow}>
              <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Result Score:</Text>
              <Text style={[styles.resultScoreValue, { color: TRACK_COLOR }]}>{score.resultScore}</Text>
            </View>
            <Text style={[styles.dateText, { color: colors.textMuted }]}>
              Saved on {formatDate(score.dateSaved)}
            </Text>
          </View>
        </TouchableOpacity>
        <GlassCloseButton
          onPress={() => handleDelete(score.id, score.title)}
          textColor={colors.text}
          surfaceColor={colors.buttonSecondary}
          size={scaleSpacing(28)}
          accessibilityLabel={`Delete ${score.title}`}
          style={styles.deleteButton}
        />
      </View>
    ));
  };

  if ((Platform.OS as string) === "web") {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <Text style={[styles.webTitle, { color: colors.text }]}>Saved Scores</Text>
          <Text style={[styles.webMessage, { color: colors.textMuted }]}>
            This feature is only available on iOS and Android.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const scrollView = (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.scrollContent,
        (loading || scores.length === 0) && styles.scrollContentEmpty,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {renderContent()}
    </ScrollView>
  );

  if (USE_NATIVE_HEADER) {
    return (
      <>
        <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
        {scrollView}
      </>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={["top", "bottom", "left", "right"]}
    >
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
      <View style={styles.webTitleRow}>
        <Text style={[styles.webTitle, { color: colors.text }]}>Saved Scores</Text>
      </View>
      {scrollView}
    </SafeAreaView>
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
  webTitleRow: {
    alignItems: "center",
    paddingVertical: scaleSpacing(12),
    paddingHorizontal: ScreenLayout.horizontalPadding,
  },
  webTitle: {
    fontSize: scaleFont(17),
    fontWeight: "600",
    textAlign: "center",
  },
  webMessage: {
    fontSize: scaleFont(16),
    textAlign: "center",
    marginTop: scaleSpacing(20),
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: scaleSpacing(280),
  },
  emptyText: {
    fontSize: scaleFont(18),
    fontWeight: "600",
    marginBottom: scaleSpacing(8),
  },
  emptySubtext: {
    fontSize: scaleFont(14),
    textAlign: "center",
    paddingHorizontal: scaleSpacing(40),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ScreenLayout.horizontalPadding,
    paddingTop: scaleSpacing(12),
    paddingBottom: scaleSpacing(20),
  },
  scrollContentEmpty: {
    flexGrow: 1,
    justifyContent: "center",
  },
  scoreCardWrapper: {
    position: "relative",
    marginBottom: scaleSpacing(12),
  },
  scoreCard: {
    borderRadius: Radius.md,
    padding: scaleSpacing(16),
    paddingRight: scaleSpacing(50),
  },
  scoreHeader: {
    marginBottom: scaleSpacing(12),
  },
  scoreTitleContainer: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    marginBottom: scaleSpacing(4),
  },
  eventType: {
    fontSize: scaleFont(14),
    fontWeight: "600",
  },
  deleteButton: {
    position: "absolute",
    top: scaleSpacing(16),
    right: scaleSpacing(16),
    zIndex: 10,
  },
  scoreDetails: {
    borderTopWidth: 1,
    paddingTop: scaleSpacing(12),
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scaleSpacing(8),
  },
  scoreLabel: {
    fontSize: scaleFont(14),
  },
  scoreValue: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
  },
  resultScoreValue: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
  },
  dateText: {
    fontSize: scaleFont(12),
    marginTop: scaleSpacing(4),
  },
});
