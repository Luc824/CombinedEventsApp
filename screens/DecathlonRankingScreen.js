import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Modal,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { worldAthleticsScores } from "../data/worldAthleticsScores";
import { Picker } from "@react-native-picker/picker";

const TRACK_COLOR = "#D35400";

// 1. Store the placing scores
const placingScores = {
  OW: [280, 250, 225, 205, 185, 170, 155, 145, 95, 85, 75, 65, 60, 55, 50, 46],
  GW: [140, 120, 105, 90, 80, 70, 60, 50, 35, 30, 24, 18, 0, 0, 0, 0],
  GL: [110, 90, 75, 65, 55, 50, 45, 40, 30, 25, 20, 15, 0, 0, 0, 0],
  A: [80, 70, 60, 50, 45, 40, 35, 30, 20, 15, 0, 0, 0, 0, 0, 0],
  B: [60, 50, 45, 40, 35, 30, 25, 20, 0, 0, 0, 0, 0, 0, 0, 0],
  C: [45, 38, 32, 26, 22, 19, 17, 15, 0, 0, 0, 0, 0, 0, 0, 0],
  D: [30, 22, 18, 16, 14, 12, 11, 10, 0, 0, 0, 0, 0, 0, 0, 0],
  E: [20, 14, 10, 8, 7, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  F: [10, 6, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};

export default function DecathlonRankingScreen() {
  const [totalPoints, setTotalPoints] = useState("");
  // 2. Add state for competition rank and place
  const [competitionRank, setCompetitionRank] = useState("");
  const [place, setPlace] = useState("");

  // New state for modal visibility and temporary picker value
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [tempCompetitionRank, setTempCompetitionRank] = useState("");

  const getResultScore = () => {
    if (!totalPoints) return "0";
    const points = parseInt(totalPoints);
    if (isNaN(points)) return "0";

    const scores = Object.keys(worldAthleticsScores.decathlon).map(Number);
    const closestLowerScore = scores
      .filter((score) => score <= points)
      .sort((a, b) => b - a)[0];
    return closestLowerScore
      ? worldAthleticsScores.decathlon[closestLowerScore]
      : "0";
  };

  // 3. Calculate the placing score
  const getPlacingScore = (rank, place) => {
    // Check if the rank is valid before trying to access placingScores
    if (!rank || !placingScores[rank]) {
      return 0; // Return 0 if rank is empty or not found
    }

    // Convert place to a number. If it's not a valid number or an empty string, return 0.
    const numericPlace = Number(place);
    if (isNaN(numericPlace) || place === "") {
      // Explicitly check for empty string
      return 0;
    }

    const placeIndex = Math.max(0, Math.min(numericPlace - 1, 15)); // Clamp between 0 and 15
    return placingScores[rank][placeIndex] || 0;
  };

  const resultScore = Number(getResultScore());
  const placingScore = getPlacingScore(competitionRank, place);
  const performanceScore = resultScore + placingScore;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Men's Decathlon</Text>
          <TextInput
            style={styles.input}
            value={totalPoints}
            onChangeText={setTotalPoints}
            keyboardType="numeric"
            placeholder="Enter total points"
            placeholderTextColor="#aaa"
          />
          <Pressable
            style={styles.input}
            onPress={() => {
              setTempCompetitionRank(competitionRank);
              setPickerVisible(true);
              Keyboard.dismiss();
            }}
          >
            <Text
              style={
                competitionRank ? styles.inputText : styles.placeholderText
              }
            >
              {competitionRank || "Select Competition Rank"}
            </Text>
          </Pressable>
          <TextInput
            style={styles.input}
            value={place}
            onChangeText={setPlace}
            keyboardType="numeric"
            placeholder="Enter your place"
            placeholderTextColor="#aaa"
          />
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Result Score</Text>
            <Text style={styles.resultScore}>{resultScore}</Text>
            <Text style={styles.resultLabel}>Placing Score</Text>
            <Text style={styles.resultScore}>{placingScore}</Text>
            <Text style={styles.resultLabel}>Performance Score</Text>
            <Text style={styles.resultScore}>{performanceScore}</Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isPickerVisible}
        onRequestClose={() => {
          setPickerVisible(!isPickerVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Picker
              selectedValue={tempCompetitionRank}
              onValueChange={(itemValue) => setTempCompetitionRank(itemValue)}
              style={styles.pickerModal}
            >
              <Picker.Item label="Select Competition Rank" value="" />
              {Object.keys(placingScores).map((rank) => (
                <Picker.Item label={rank} value={rank} key={rank} />
              ))}
            </Picker>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonCancel]}
                onPress={() => setPickerVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.buttonDone]}
                onPress={() => {
                  setCompetitionRank(tempCompetitionRank);
                  setPickerVisible(false);
                }}
              >
                <Text style={styles.buttonText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    backgroundColor: "#000",
    padding: 0,
    alignItems: "center",
  },
  scrollContentContainer: {
    flexGrow: 1,
    backgroundColor: "#000",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    fontSize: 18,
    marginBottom: 30,
    width: "100%",
    textAlign: "center",
  },
  resultContainer: {
    alignItems: "center",
    marginTop: 10,
    backgroundColor: "transparent",
    padding: 20,
    borderRadius: 20,
    width: "100%",
  },
  resultLabel: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  resultScore: {
    color: TRACK_COLOR,
    fontSize: 36,
    fontWeight: "bold",
  },
  inputText: {
    color: "#fff",
    fontSize: 18,
  },
  placeholderText: {
    color: "#aaa",
    fontSize: 18,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  pickerModal: {
    width: "100%",
    color: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 10,
    width: "100%",
    justifyContent: "space-around",
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: "45%",
    alignItems: "center",
  },
  buttonCancel: {
    backgroundColor: "#555",
  },
  buttonDone: {
    backgroundColor: TRACK_COLOR,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
