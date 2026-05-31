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
import { Radius, ScreenLayout, TRACK_COLOR, actionButtonStyle, buttonElevation } from "../../constants/ui";
import { useTheme } from "../../contexts/ThemeContext";
import { worldAthleticsScores } from "../../data/worldAthleticsScores";
import { scaleFont, scaleSpacing } from "../../utils/uiScale";

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
  OW: [200, 175, 160, 145, 130, 120, 110, 100, 67, 60, 53, 46, 42, 38, 35, 32],
  GW: [100, 85, 75, 65, 56, 49, 42, 35, 25, 21, 17, 13, 0, 0, 0, 0],
  GL: [80, 65, 55, 46, 39, 35, 31, 28, 21, 17, 14, 11, 0, 0, 0, 0],
  A: [56, 49, 42, 35, 31, 27, 24, 21, 15, 13, 11, 9, 0, 0, 0, 0],
  B: [42, 35, 31, 27, 24, 21, 18, 15,13, 11, 9, 8, 0, 0, 0, 0],
  C: [32, 27, 22, 18, 15, 13, 12, 11, 10, 9, 8, 7, 0, 0, 0, 0],
  D: [21, 15, 13, 11, 10, 9, 8, 7, 0, 0, 0, 0, 0, 0, 0, 0],
  E: [14, 10, 7, 6, 5, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  F: [7, 4, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
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
        inputMode="numeric"
        placeholder="Place"
        placeholderTextColor={colors.textMuted}
        maxLength={2}
      />
      <TextInput
        style={[styles.input, { backgroundColor: colors.inputBackground, color: colors.inputText, borderWidth: 1, borderColor: colors.inputBorder || colors.border }]}
        value={points}
        onChangeText={setPoints}
        keyboardType="number-pad"
        inputMode="numeric"
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
      <TouchableOpacity style={[styles.clearButton, actionButtonStyle, buttonElevation(), { backgroundColor: colors.buttonSecondary }]} onPress={clearAll}>
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
    ...Platform.select({
      web: {
        alignItems: "center",
      },
    }),
  },
  container: {
    flex: 1,
    paddingHorizontal: scaleSpacing(10),
    ...Platform.select({
      web: {
        maxWidth: ScreenLayout.contentMaxWidth,
        alignSelf: "center",
        width: "100%",
      },
    }),
  },
  scrollContent: {
    padding: scaleSpacing(10),
    paddingBottom: scaleSpacing(16),
    paddingTop: ScreenLayout.topPadding,
  },
  title: {
    fontSize: scaleFont(28),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: scaleSpacing(14),
  },
  performanceSection: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: scaleSpacing(8),
    marginBottom: scaleSpacing(8),
    marginHorizontal: scaleSpacing(16),
    minWidth: 0,
  },
  performanceTitle: {
    fontSize: scaleFont(14),
    fontWeight: "bold",
    marginBottom: scaleSpacing(3),
    textAlign: "center",
  },
  dropdown: {
    borderRadius: Radius.sm,
    paddingVertical: scaleSpacing(6),
    paddingHorizontal: scaleSpacing(12),
    marginBottom: scaleSpacing(5),
    marginTop: scaleSpacing(2),
  },
  dropdownText: {
    fontSize: scaleFont(13),
  },
  dropdownPlaceholder: {
    fontSize: scaleFont(13),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentRefined: {
    borderRadius: Radius.md,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: "stretch",
    minWidth: 340,
    maxWidth: "90%",
  },
  modalContentEvent: {
    borderRadius: Radius.md,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
    minWidth: 200,
    maxWidth: 320,
  },
  modalPromptRefined: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
  },
  modalOptionRank: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    minHeight: 40,
    width: "100%",
    borderRadius: Radius.sm,
    marginVertical: 2,
    justifyContent: "center",
  },
  modalOptionEventButton: {
    width: 200,
    alignSelf: "center",
  },
  modalOptionText: {
    fontSize: 14,
    textAlign: "center",
    flexWrap: "wrap",
  },
  rankOptionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "100%",
    flexWrap: "wrap",
  },
  rankLetter: {
    fontSize: 14,
    fontWeight: "bold",
    width: 40,
    textAlign: "left",
    marginRight: 8,
    flexShrink: 0,
  },
  rankDescription: {
    fontSize: 14,
    flex: 1,
    textAlign: "left",
    flexShrink: 1,
    minWidth: 0,
  },
  input: {
    borderRadius: Radius.sm,
    paddingVertical: scaleSpacing(5),
    paddingHorizontal: scaleSpacing(10),
    fontSize: scaleFont(13),
    marginBottom: scaleSpacing(5),
    marginTop: scaleSpacing(2),
    height: scaleSpacing(30),
    ...Platform.select({
      android: {
        height: scaleSpacing(32),
        paddingVertical: 0,
        textAlignVertical: "center",
      },
    }),
  },
  resultLabel: {
    fontSize: scaleFont(12),
    marginTop: scaleSpacing(1),
  },
  resultValue: {
    fontSize: scaleFont(12),
    fontWeight: "bold",
  },
  averageBox: {
    borderWidth: 1,
    borderRadius: Radius.md,
    padding: scaleSpacing(8),
    alignItems: "center",
    marginTop: scaleSpacing(6),
    marginBottom: 0,
    marginHorizontal: scaleSpacing(16),
  },
  averageLabel: {
    fontSize: scaleFont(14),
    fontWeight: "bold",
    marginBottom: scaleSpacing(1),
  },
  averageValue: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
  },
  clearButton: {
    marginVertical: scaleSpacing(6),
    marginHorizontal: scaleSpacing(16),
  },
  clearButtonText: {
    fontWeight: "600",
    fontSize: scaleFont(15),
  },
});
