import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { ThemeColors } from "../constants/ThemeColors";
import { getSavedScores, deleteScore, SavedScore, getEventTypeDisplayName } from "../utils/scoreStorage";

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
    } catch (error) {
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
            } catch (error) {
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

  if ((Platform.OS as string) === "web") {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: colors.text }]}>Saved Scores</Text>
          </View>
          <Text style={[styles.webMessage, { color: colors.textMuted }]}>
            This feature is only available on iOS and Android.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
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
          <Text style={[styles.title, { color: colors.text }]}>Saved Scores</Text>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>Loading...</Text>
          </View>
        ) : scores.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={[styles.emptyText, { color: colors.text }]}>No saved scores yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
              Save scores from any calculator screen to see them here
            </Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {scores.map((score) => (
              <View key={score.id} style={styles.scoreCardWrapper}>
                <TouchableOpacity
                  style={[styles.scoreCard, { backgroundColor: colors.surfaceSolid, borderWidth: 1, borderColor: colors.border }]}
                  onPress={() => router.push({
                    pathname: "/saved-score-detail",
                    params: { score: JSON.stringify(score) },
                  } as any)}
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
                      <Text style={[styles.scoreValue, { color: colors.text }]}>
                        {score.totalScore} Points
                      </Text>
                    </View>
                    <View style={styles.scoreRow}>
                      <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Result Score:</Text>
                      <Text style={[styles.resultScoreValue, { color: TRACK_COLOR }]}>
                        {score.resultScore}
                      </Text>
                    </View>
                    <Text style={[styles.dateText, { color: colors.textMuted }]}>
                      Saved on {formatDate(score.dateSaved)}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.deleteButton, { backgroundColor: colors.buttonSecondary }]}
                  onPress={() => handleDelete(score.id, score.title)}
                >
                  <Text style={[styles.deleteButtonText, { color: colors.buttonText }]}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  titleRow: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "android" ? 26 : 14,
    marginBottom: 20,
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
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
  webMessage: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  scoreCardWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  scoreCard: {
    borderRadius: 12,
    padding: 16,
    paddingRight: 50,
  },
  scoreHeader: {
    marginBottom: 12,
  },
  scoreTitleContainer: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  eventType: {
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  scoreDetails: {
    borderTopWidth: 1,
    paddingTop: 12,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 14,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  resultScoreValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 12,
    marginTop: 4,
  },
});

