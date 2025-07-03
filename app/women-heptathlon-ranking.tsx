import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  StatusBar,
  Modal,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { worldAthleticsScores } from "../data/worldAthleticsScores";
import { Picker } from "@react-native-picker/picker";

const TRACK_COLOR = "#D35400";

const placingScores: Record<string, number[]> = {
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

export default function WomenHeptathlonRankingScreen() {
  const [totalPoints, setTotalPoints] = useState("");
  const [competitionRank, setCompetitionRank] = useState("");
  const [place, setPlace] = useState("");
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [tempCompetitionRank, setTempCompetitionRank] = useState("");

  const getResultScore = () => {
    if (!totalPoints) return "0";
    const points = parseInt(totalPoints);
    if (isNaN(points)) return "0";
    const scores = Object.keys(worldAthleticsScores.womenHeptathlon).map(
      Number
    );
    const closestLowerScore = scores
      .filter((score) => score <= points)
      .sort((a, b) => b - a)[0];
    return closestLowerScore
      ? worldAthleticsScores.womenHeptathlon[String(closestLowerScore)]
      : "0";
  };

  const getPlacingScore = (rank: string, place: string) => {
    if (!rank || !placingScores[rank]) return 0;
    const numericPlace = Number(place);
    if (isNaN(numericPlace) || place === "") return 0;
    const placeIndex = Math.max(0, Math.min(numericPlace - 1, 15));
    return placingScores[rank][placeIndex] || 0;
  };

  const resultScore = Number(getResultScore());
  const placingScore = getPlacingScore(competitionRank, place);
  const performanceScore = resultScore + placingScore;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Women's Heptathlon</Text>
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
      </TouchableWithoutFeedback>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPickerVisible}
        onRequestClose={() => setPickerVisible(!isPickerVisible)}
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
    width: 300,
    textAlign: "center",
  },
  inputText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  placeholderText: {
    fontSize: 18,
    color: "#aaa",
    textAlign: "center",
  },
  resultContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  resultLabel: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
  },
  resultScore: {
    color: TRACK_COLOR,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    backgroundColor: "#222",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: 300,
  },
  pickerModal: {
    width: 250,
    color: "#fff",
    backgroundColor: "#222",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonCancel: {
    backgroundColor: "#888",
  },
  buttonDone: {
    backgroundColor: TRACK_COLOR,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
