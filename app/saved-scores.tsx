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
import { useRouter } from "expo-router";
import { getSavedScores, deleteScore, SavedScore, getEventTypeDisplayName } from "../utils/scoreStorage";

const TRACK_COLOR = "#D35400";

export default function SavedScoresScreen() {
  const router = useRouter();
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

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.container}>
          <Text style={styles.title}>Saved Scores</Text>
          <Text style={styles.webMessage}>
            This feature is only available on iOS and Android.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Saved Scores</Text>
        </View>

        {loading ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>Loading...</Text>
          </View>
        ) : scores.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No saved scores yet</Text>
            <Text style={styles.emptySubtext}>
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
                  style={styles.scoreCard}
                  onPress={() => router.push({
                    pathname: "/saved-score-detail",
                    params: { score: JSON.stringify(score) },
                  } as any)}
                  activeOpacity={0.7}
                >
                  <View style={styles.scoreHeader}>
                    <View style={styles.scoreTitleContainer}>
                      <Text style={styles.scoreTitle}>{score.title}</Text>
                      <Text style={styles.eventType}>
                        {getEventTypeDisplayName(score.eventType)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.scoreDetails}>
                    <View style={styles.scoreRow}>
                      <Text style={styles.scoreLabel}>Total Score:</Text>
                      <Text style={styles.scoreValue}>
                        {score.totalScore} Points
                      </Text>
                    </View>
                    <View style={styles.scoreRow}>
                      <Text style={styles.scoreLabel}>Result Score:</Text>
                      <Text style={styles.resultScoreValue}>
                        {score.resultScore}
                      </Text>
                    </View>
                    <Text style={styles.dateText}>
                      Saved on {formatDate(score.dateSaved)}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(score.id, score.title)}
                >
                  <Text style={styles.deleteButtonText}>✕</Text>
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
    backgroundColor: "#000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  webMessage: {
    color: "#888",
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
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#888",
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
    backgroundColor: "#222",
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
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  eventType: {
    color: TRACK_COLOR,
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
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  scoreDetails: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 12,
  },
  scoreRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  scoreLabel: {
    color: "#bbb",
    fontSize: 14,
  },
  scoreValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultScoreValue: {
    color: TRACK_COLOR,
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
  },
});

