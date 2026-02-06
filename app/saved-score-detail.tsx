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
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import { ThemeColors } from "../constants/ThemeColors";
import { SavedScore, getEventTypeDisplayName, getEventNames } from "../utils/scoreStorage";

const TRACK_COLOR = "#D35400";

export default function SavedScoreDetailScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
  const params = useLocalSearchParams<{ score: string }>();
  
  let score: SavedScore | null = null;
  try {
    score = params.score ? JSON.parse(params.score) : null;
  } catch (error) {
    console.error("Error parsing score:", error);
  }

  if (!score) {
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
            <Text style={[styles.title, { color: colors.text }]}>Saved Score</Text>
          </View>
          <Text style={[styles.errorText, { color: colors.text }]}>Score not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const eventNames = getEventNames(score.eventType);

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
          <Text style={[styles.title, { color: colors.text }]}>{score.title}</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.summaryCard, { backgroundColor: colors.surfaceSolid, borderWidth: 1, borderColor: colors.border }]}>
            <Text style={[styles.eventType, { color: TRACK_COLOR }]}>{getEventTypeDisplayName(score.eventType)}</Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Score:</Text>
              <Text style={[styles.summaryValue, { color: colors.text }]}>{score.totalScore} Points</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Result Score:</Text>
              <Text style={[styles.resultScoreValue, { color: TRACK_COLOR }]}>{score.resultScore}</Text>
            </View>
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
  errorText: {
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
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  eventType: {
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
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  resultScoreValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  eventCard: {
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
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  eventPoints: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },
  eventResult: {
    fontSize: 14,
  },
});

