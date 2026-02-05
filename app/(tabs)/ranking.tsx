import React, { useState } from "react";
import {
  Keyboard,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { ThemeColors } from "../../constants/ThemeColors";
import { useTheme } from "../../contexts/ThemeContext";
import { worldAthleticsScores } from "../../data/worldAthleticsScores";

const TRACK_COLOR = "#D35400";

const EVENTS = [
  { label: "Men's Decathlon", value: "decathlon", gender: "men" },
  { label: "Men's Heptathlon", value: "menHeptathlon", gender: "men" },
  { label: "Women's Heptathlon", value: "womenHeptathlon", gender: "women" },
  { label: "Women's Pentathlon", value: "womenPentathlon", gender: "women" },
];

// Add index signatures to allow string keys
const worldAthleticsScoresTyped: Record<
  string,
  Record<string, number>
> = worldAthleticsScores as any;
const PLACING_SCORES: Record<string, number[]> = {
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

const RANK_DESCRIPTIONS: Record<string, string> = {
  OW: "Olympics / World Championships",
  GW: "World Indoor Championships",
  GL: "Area Championships / Gold Meetings",
  A: "Area Indoor Championships / Gold Meetings",
  B: "National Championships / Silver Meetings",
  C: "Bronze Meetings",
  D: "National Indoor Championships",
  E: "Euh...",
  F: "Other",
};

const getResultScore = (event: string, points: string): number => {
  if (!points) return 0;
  const pts = parseInt(points);
  if (isNaN(pts)) return 0;
  let table: Record<string, number> = {};
  switch (event) {
    case "decathlon":
      table = worldAthleticsScoresTyped.decathlon;
      break;
    case "menHeptathlon":
      table = worldAthleticsScoresTyped.menHeptathlon;
      break;
    case "womenHeptathlon":
      table = worldAthleticsScoresTyped.womenHeptathlon;
      break;
    case "womenPentathlon":
      table = worldAthleticsScoresTyped.womenPentathlon;
      break;
    default:
      return 0;
  }
  const scores = Object.keys(table).map(Number);
  const closestLowerScore = scores
    .filter((score) => score <= pts)
    .sort((a, b) => b - a)[0];
  return closestLowerScore ? table[String(closestLowerScore)] : 0;
};

const getPlacingScore = (rank: string, place: string): number => {
  if (!rank || !PLACING_SCORES[rank]) return 0;
  const numericPlace = Number(place);
  if (isNaN(numericPlace) || place === "") return 0;
  const placeIndex = Math.max(0, Math.min(numericPlace - 1, 15));
  return PLACING_SCORES[rank][placeIndex] || 0;
};

interface DropdownProps {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onSelect: (val: string) => void;
}

function Dropdown({ label, value, options, onSelect }: DropdownProps) {
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
  const [modalVisible, setModalVisible] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label || label;
  return (
    <>
      <TouchableOpacity
        style={[styles.dropdown, { backgroundColor: colors.inputBackground, borderWidth: 1, borderColor: colors.inputBorder || colors.border }]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[value ? styles.dropdownText : styles.dropdownPlaceholder, { color: value ? colors.text : colors.textMuted }]}>
          {selectedLabel}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View style={[label === "Rank" ? styles.modalContentRefined : styles.modalContentEvent, { backgroundColor: colors.cardBackground }]}>
                <Text style={[styles.modalPromptRefined, { color: colors.textSecondary }]}>
                  {label === "Rank" ? "Tap to select a rank" : "Tap to select an event"}
                </Text>
                {options.map((item) => {
                // For rank options, split the letter from the description for alignment
                const isRankOption = label === "Rank";
                if (isRankOption && item.label.includes(" - ")) {
                  const [rankLetter, description] = item.label.split(" - ");
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[styles.modalOptionRank, { backgroundColor: colors.surfaceSolid, borderColor: colors.border, borderWidth: 1 }]}
                      onPress={() => {
                        onSelect(item.value);
                        setModalVisible(false);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.rankOptionRow}>
                        <Text style={[styles.rankLetter, { color: colors.text }]}>{rankLetter}</Text>
                        <Text style={[styles.rankDescription, { color: colors.text }]} numberOfLines={undefined}>{description}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }
                return (
                  <TouchableOpacity
                    key={item.value}
                    style={[styles.modalOptionRank, styles.modalOptionEventButton, { backgroundColor: colors.surfaceSolid, borderColor: colors.border, borderWidth: 1 }]}
                    onPress={() => {
                      onSelect(item.value);
                      setModalVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.modalOptionText, { color: colors.text }]}>{item.label}</Text>
                  </TouchableOpacity>
                );
              })}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

interface PerformanceEntryProps {
  index: number;
  event: string;
  setEvent: (val: string) => void;
  rank: string;
  setRank: (val: string) => void;
  place: string;
  setPlace: (val: string) => void;
  points: string;
  setPoints: (val: string) => void;
  eventOptions: { label: string; value: string; gender: string }[];
  resultScore: number;
  placingScore: number;
  performanceScore: number;
}

function PerformanceEntry({
  index,
  event,
  setEvent,
  rank,
  setRank,
  place,
  setPlace,
  points,
  setPoints,
  eventOptions,
  resultScore,
  placingScore,
  performanceScore,
}: PerformanceEntryProps) {
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
  return (
    <View style={[styles.performanceSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text style={[styles.performanceTitle, { color: colors.text }]}>Performance {index + 1}</Text>
      <Dropdown
        label="Event"
        value={event}
        options={eventOptions.map((e) => ({ label: e.label, value: e.value }))}
        onSelect={setEvent}
      />
      <Dropdown
        label="Rank"
        value={rank}
        options={Object.keys(PLACING_SCORES).map((r) => ({
          label: `${r} - ${RANK_DESCRIPTIONS[r]}`,
          value: r,
        }))}
        onSelect={setRank}
      />
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderWidth: 1, borderColor: colors.inputBorder || colors.border }]}
        value={place}
        onChangeText={setPlace}
        keyboardType="number-pad"
        placeholder="Place"
        placeholderTextColor={colors.textMuted}
        maxLength={2}
      />
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderWidth: 1, borderColor: colors.inputBorder || colors.border }]}
        value={points}
        onChangeText={setPoints}
        keyboardType="number-pad"
        placeholder="Points"
        placeholderTextColor={colors.textMuted}
        maxLength={5}
      />
      <Text style={[styles.resultLabel, { color: colors.text }]}>
        Result Score: <Text style={[styles.resultValue, { color: TRACK_COLOR }]}>{resultScore}</Text>
      </Text>
      <Text style={[styles.resultLabel, { color: colors.text }]}>
        Placing Score: <Text style={[styles.resultValue, { color: TRACK_COLOR }]}>{placingScore}</Text>
      </Text>
      <Text style={[styles.resultLabel, { color: colors.text }]}>
        Performance Score:{" "}
        <Text style={[styles.resultValue, { color: TRACK_COLOR }]}>{performanceScore}</Text>
      </Text>
    </View>
  );
}

export default function RankingsScreen() {
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
  // State for both performances
  const [event1, setEvent1] = useState("");
  const [rank1, setRank1] = useState("");
  const [place1, setPlace1] = useState("");
  const [points1, setPoints1] = useState("");

  const [event2, setEvent2] = useState("");
  const [rank2, setRank2] = useState("");
  const [place2, setPlace2] = useState("");
  const [points2, setPoints2] = useState("");

  // Synchronize event options for both performances
  let event1Options = EVENTS;
  let event2Options = EVENTS;
  const event1Obj = EVENTS.find((e) => e.value === event1);
  const event2Obj = EVENTS.find((e) => e.value === event2);
  if (event1Obj && event2Obj) {
    // If both are selected, restrict both to the same gender
    if (event1Obj.gender === event2Obj.gender) {
      event1Options = event2Options = EVENTS.filter(
        (e) => e.gender === event1Obj.gender
      );
    }
  } else if (event1Obj) {
    event2Options = EVENTS.filter((e) => e.gender === event1Obj.gender);
  } else if (event2Obj) {
    event1Options = EVENTS.filter((e) => e.gender === event2Obj.gender);
  }

  const resultScore1 = getResultScore(event1, points1);
  const placingScore1 = getPlacingScore(rank1, place1);
  const performanceScore1 = Number(resultScore1) + Number(placingScore1);

  const resultScore2 = getResultScore(event2, points2);
  const placingScore2 = getPlacingScore(rank2, place2);
  const performanceScore2 = Number(resultScore2) + Number(placingScore2);

  // Check if all inputs for both performances are filled
  const allInputsFilled = 
    event1 && rank1 && place1 && points1 &&
    event2 && rank2 && place2 && points2;

  const average =
    allInputsFilled
      ? Math.floor((performanceScore1 + performanceScore2) / 2).toString()
      : "-";

  const clearAll = () => {
    setEvent1("");
    setRank1("");
    setPlace1("");
    setPoints1("");
    setEvent2("");
    setRank2("");
    setPlace2("");
    setPoints2("");
  };

  const scrollContent = (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>Rankings Calculator</Text>
      <PerformanceEntry
        index={0}
        event={event1}
        setEvent={setEvent1}
        rank={rank1}
        setRank={setRank1}
        place={place1}
        setPlace={setPlace1}
        points={points1}
        setPoints={setPoints1}
        eventOptions={event1Options}
        resultScore={resultScore1}
        placingScore={placingScore1}
        performanceScore={performanceScore1}
      />
      <PerformanceEntry
        index={1}
        event={event2}
        setEvent={setEvent2}
        rank={rank2}
        setRank={setRank2}
        place={place2}
        setPlace={setPlace2}
        points={points2}
        setPoints={setPoints2}
        eventOptions={event2Options}
        resultScore={resultScore2}
        placingScore={placingScore2}
        performanceScore={performanceScore2}
      />
      <View style={[styles.averageBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.averageLabel, { color: colors.text }]}>Ranking Score:</Text>
        <Text style={[styles.averageValue, { color: TRACK_COLOR }]}>{average}</Text>
      </View>
      <TouchableOpacity style={[styles.clearButton, { backgroundColor: colors.buttonSecondary }]} onPress={clearAll}>
        <Text style={[styles.clearButtonText, { color: colors.buttonText }]}>Clear</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
      {Platform.OS === 'web' ? (
        scrollContent
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          {scrollContent}
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
    ...Platform.select({
      web: {
        alignItems: "center",
      },
    }),
  },
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 10,
    ...Platform.select({
      web: {
        maxWidth: 700,
        alignSelf: "center",
        width: "100%",
      },
    }),
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  performanceSection: {
    backgroundColor: "rgba(34, 34, 34, 0.6)",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 16,
    minWidth: 0,
  },
  performanceTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  dropdown: {
    backgroundColor: "#222",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
    marginTop: 2,
  },
  dropdownText: {
    color: "#fff",
    fontSize: 14,
  },
  dropdownPlaceholder: {
    color: "#aaa",
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentRefined: {
    backgroundColor: "#222",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: "stretch",
    minWidth: 340,
    maxWidth: "90%",
  },
  modalContentEvent: {
    backgroundColor: "#222",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    minWidth: 200,
    maxWidth: 320,
  },
  modalPromptRefined: {
    color: "#bbb",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
  },
  modalOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    minHeight: 40,
    width: "100%",
    alignItems: "center",
  },
  modalOptionRank: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 40,
    width: "100%",
    backgroundColor: "#333",
    borderRadius: 8,
    marginVertical: 2,
    justifyContent: "center",
  },
  modalOptionEventButton: {
    width: 200,
    alignSelf: "center",
  },
  modalOptionEvent: {
    paddingVertical: 4,
    paddingHorizontal: 0,
    minHeight: 40,
    alignItems: "stretch",
    alignSelf: "center",
    width: 240,
    justifyContent: "center",
  },
  modalOptionText: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    flexWrap: "wrap",
  },
  modalOptionTextEvent: {
    fontSize: 14,
    textAlign: "center",
    flexWrap: "wrap",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: "100%",
  },
  rankOptionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    flexWrap: "wrap",
  },
  rankLetter: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    width: 40,
    textAlign: "left",
    marginRight: 8,
    flexShrink: 0,
  },
  rankDescription: {
    color: "#fff",
    fontSize: 14,
    flex: 1,
    textAlign: "left",
    flexShrink: 1,
    minWidth: 0,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    marginBottom: 6,
    marginTop: 2,
    height: 32,
  },
  resultLabel: {
    color: "#fff",
    fontSize: 13,
    marginTop: 2,
  },
  resultValue: {
    color: TRACK_COLOR,
    fontSize: 13,
    fontWeight: "bold",
  },
  averageBox: {
    backgroundColor: "rgba(34, 34, 34, 0.6)",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 0,
    marginHorizontal: 16,
  },
  averageLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 2,
  },
  averageValue: {
    color: TRACK_COLOR,
    fontSize: 18,
    fontWeight: "bold",
  },
  clearButton: {
    backgroundColor: "#444",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
