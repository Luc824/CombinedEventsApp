import React from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SavedScore, getEventTypeDisplayName, getEventNames } from "../utils/scoreStorage";

const TRACK_COLOR = "#D35400";

export default function SavedScoreDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ score: string }>();
  
  let score: SavedScore | null = null;
  try {
    score = params.score ? JSON.parse(params.score) : null;
  } catch (error) {
    console.error("Error parsing score:", error);
  }

  if (!score) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.container}>
          <Text style={styles.errorText}>Score not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const eventNames = getEventNames(score.eventType);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButtonTouchable} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{score.title}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.summaryCard}>
            <Text style={styles.eventType}>{getEventTypeDisplayName(score.eventType)}</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Score:</Text>
              <Text style={styles.summaryValue}>{score.totalScore} Points</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Result Score:</Text>
              <Text style={styles.resultScoreValue}>{score.resultScore}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Event Performances</Text>
          {eventNames.map((eventName, index) => (
            <View key={index} style={styles.eventCard}>
              <View style={styles.eventHeader}>
                <Text style={styles.eventName}>{eventName}</Text>
                <Text style={styles.eventPoints}>{score.points[index]} Points</Text>
              </View>
              <Text style={styles.eventResult}>
                {score.results[index] || "No result"}
              </Text>
            </View>
          ))}
        </ScrollView>
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButtonTouchable: {
    marginRight: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  backButtonText: {
    color: TRACK_COLOR,
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
  },
  errorText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  summaryCard: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  eventType: {
    color: TRACK_COLOR,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    color: "#bbb",
    fontSize: 16,
  },
  summaryValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resultScoreValue: {
    color: TRACK_COLOR,
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  eventCard: {
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eventName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  eventPoints: {
    color: TRACK_COLOR,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },
  eventResult: {
    color: "#bbb",
    fontSize: 14,
  },
});

