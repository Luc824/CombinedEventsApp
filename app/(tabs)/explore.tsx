import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

const TRACK_COLOR = "#D35400";

export default function RankingsScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.container}>
        <Text style={styles.title}>Rankings</Text>
        <Text style={styles.sectionTitle}>Men</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.eventButton, styles.pillButton]}
            onPress={() => router.push("/decathlon-ranking")}
          >
            <Text style={styles.eventButtonText}>Decathlon</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.eventButton, styles.pillButton]}
            onPress={() => router.push("/men-heptathlon-ranking")}
          >
            <Text style={styles.eventButtonText}>Heptathlon</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionTitle}>Women</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.eventButton, styles.pillButton]}
            onPress={() => router.push("/women-heptathlon-ranking")}
          >
            <Text style={styles.eventButtonText}>Heptathlon</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.eventButton, styles.pillButton]}
            onPress={() => router.push("/women-pentathlon-ranking")}
          >
            <Text style={styles.eventButtonText}>Pentathlon</Text>
          </TouchableOpacity>
        </View>
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
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
    lineHeight: 34,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  button: {
    backgroundColor: TRACK_COLOR,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 30,
    width: "100%",
    alignSelf: "center",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 20,
  },
  eventButton: {
    backgroundColor: TRACK_COLOR,
    borderColor: "#fff",
    borderWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 0,
  },
  pillButton: {
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 30,
    flex: 1,
  },
  eventButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
