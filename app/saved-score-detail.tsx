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
import { scaleFont, scaleSpacing } from "../utils/uiScale";

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
    padding: scaleSpacing(20),
  },
  titleRow: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "android" ? scaleSpacing(26) : scaleSpacing(14),
    marginBottom: scaleSpacing(20),
    position: "relative",
    paddingLeft: scaleSpacing(50),
    paddingRight: scaleSpacing(50),
  },
  backButton: {
    width: scaleSpacing(40),
    height: scaleSpacing(40),
    position: "absolute",
    left: 0,
    zIndex: 1,
    borderWidth: 1,
    borderRadius: scaleSpacing(20),
    alignItems: "center",
    justifyContent: "center",
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
    borderRadius: scaleSpacing(12),
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
  eventCard: {
    borderRadius: scaleSpacing(12),
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

