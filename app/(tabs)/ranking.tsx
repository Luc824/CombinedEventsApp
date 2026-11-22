import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import InfoButton from "../../components/InfoButton";
import KeyboardDismissScrollView from "../../components/KeyboardDismissScrollView";
import PressableFeedback from "../../components/PressableFeedback";
import { ThemeColors } from "../../constants/ThemeColors";
import { Radius, ScreenLayout, TRACK_COLOR, actionButtonStyle, buttonElevation, formDropdownStyle, formFieldStyle } from "../../constants/ui";
import { useTheme } from "../../contexts/ThemeContext";
import { useStableTabPaint } from "../../hooks/useStableTabPaint";
import { worldAthleticsScores } from "../../data/worldAthleticsScores";
import { FROZEN_INSETS } from "../../utils/frozenSafeArea";
import { openInNewTab } from "../../utils/openUrl";
import { scaleFont, scaleSpacing } from "../../utils/uiScale";
import { useSafePush } from "../../utils/useSafePush";

const WORLD_RANKINGS_URLS = {
  men: "https://worldathletics.org/world-rankings/decathlon/men",
  women: "https://worldathletics.org/world-rankings/heptathlon/women",
} as const;

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
  if (!Number.isInteger(numericPlace) || numericPlace < 1) return 0;
  const placeIndex = Math.min(numericPlace - 1, 15);
  return PLACING_SCORES[rank][placeIndex] || 0;
};

const isValidPlace = (place: string): boolean => {
  const numericPlace = Number(place);
  return place !== "" && Number.isInteger(numericPlace) && numericPlace >= 1;
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
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const [modalVisible, setModalVisible] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label || label;
  const modalMaxHeight = Math.min(windowHeight * 0.85, 640);
  const modalWidth = Math.min(windowWidth * 0.92, 380);
  const isRank = label === "Rank";
  const panelShadow =
    Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: theme === "dark" ? 0.45 : 0.18,
        shadowRadius: 24,
      },
      android: { elevation: 12 },
      default: {},
    }) ?? {};

  const close = () => setModalVisible(false);

  return (
    <>
      <PressableFeedback
        style={[
          styles.dropdown,
          formDropdownStyle,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            borderWidth: StyleSheet.hairlineWidth,
          },
        ]}
        contentAlign="flex-start"
        onPress={() => setModalVisible(true)}
      >
        <Text style={[value ? styles.dropdownText : styles.dropdownPlaceholder, { color: value ? colors.text : colors.textMuted }]}>
          {selectedLabel}
        </Text>
      </PressableFeedback>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <TouchableWithoutFeedback onPress={close}>
          <View style={[styles.modalOverlay, { backgroundColor: colors.modalOverlay }]}>
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View
                style={[
                  styles.modalPanel,
                  panelShadow,
                  {
                    backgroundColor: colors.cardBackground,
                    borderColor: colors.border,
                    width: modalWidth,
                    maxHeight: modalMaxHeight,
                  },
                ]}
              >
                <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.modalTitle, { color: colors.text }]}>
                    {isRank ? "Rank" : "Event"}
                  </Text>
                </View>
                <ScrollView
                  style={{ maxHeight: modalMaxHeight - scaleSpacing(44) }}
                  contentContainerStyle={styles.modalScrollContent}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                >
                  {options.map((item, index) => {
                    const selected = item.value === value;
                    const isLast = index === options.length - 1;
                    const isRankOption = isRank && item.label.includes(" - ");
                    const rankLetter = isRankOption ? item.label.split(" - ")[0] : null;
                    const description = isRankOption
                      ? item.label.split(" - ").slice(1).join(" - ")
                      : item.label;

                    return (
                      <PressableFeedback
                        key={item.value}
                        contentAlign="stretch"
                        style={[
                          styles.modalRow,
                          !isLast && {
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            borderBottomColor: colors.border,
                          },
                          selected && {
                            backgroundColor:
                              theme === "dark"
                                ? "rgba(211, 84, 0, 0.16)"
                                : "rgba(211, 84, 0, 0.08)",
                          },
                        ]}
                        onPress={() => {
                          onSelect(item.value);
                          close();
                        }}
                      >
                        <View style={styles.modalRowMain}>
                          {rankLetter ? (
                            <Text
                              style={[
                                styles.rankLetter,
                                { color: selected ? TRACK_COLOR : colors.text },
                              ]}
                            >
                              {rankLetter}
                            </Text>
                          ) : null}
                          <Text
                            style={[
                              rankLetter ? styles.rankDescription : styles.modalOptionText,
                              {
                                color: colors.text,
                                fontWeight: selected ? "600" : "400",
                              },
                            ]}
                            numberOfLines={isRankOption ? 2 : 1}
                          >
                            {description}
                          </Text>
                        </View>
                        {selected ? (
                          <Ionicons
                            name="checkmark"
                            size={scaleFont(16)}
                            color={TRACK_COLOR}
                          />
                        ) : (
                          <View style={styles.modalCheckSpacer} />
                        )}
                      </PressableFeedback>
                    );
                  })}
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

/** Same press-language settle as Event/Rank dropdowns when Place/Points gain focus. */
function FocusField({
  style,
  onFocus,
  onBlur,
  ...rest
}: TextInputProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const pulseIn = () => {
    scale.setValue(0.97);
    opacity.setValue(0.72);
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 260,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 110,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View style={{ width: "100%", transform: [{ scale }], opacity }}>
      <TextInput
        {...rest}
        style={style}
        onFocus={(event) => {
          pulseIn();
          onFocus?.(event);
        }}
        onBlur={onBlur}
      />
    </Animated.View>
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
  const inputStyle = [
    formFieldStyle,
    styles.inputFullWidth,
    {
      backgroundColor: colors.cardBackground,
      color: colors.inputText,
      borderColor: colors.border,
      borderWidth: StyleSheet.hairlineWidth,
    },
  ];

  return (
    <View
      style={[
        styles.performanceSection,
        index > 0 && [
          styles.performanceSectionSpaced,
          { borderTopColor: colors.border },
        ],
      ]}
    >
      <Text style={[styles.performanceTitle, { color: colors.textSecondary }]}>
        Performance {index + 1}
      </Text>
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
      <View style={styles.inputRow}>
        <View style={styles.inputHalf}>
          <FocusField
            style={inputStyle}
            value={place}
            onChangeText={setPlace}
            keyboardType="number-pad"
            inputMode="numeric"
            placeholder="Place"
            placeholderTextColor={colors.textMuted}
            maxLength={2}
            selectTextOnFocus
          />
        </View>
        <View style={styles.inputHalf}>
          <FocusField
            style={inputStyle}
            value={points}
            onChangeText={setPoints}
            keyboardType="number-pad"
            inputMode="numeric"
            placeholder="Points"
            placeholderTextColor={colors.textMuted}
            maxLength={5}
            selectTextOnFocus
          />
        </View>
      </View>
      <View style={styles.scoreSummary}>
        <View style={styles.scoreMetric}>
          <Text style={[styles.scoreLabel, { color: colors.textMuted }]}>Result</Text>
          <Text style={[styles.scoreValue, { color: TRACK_COLOR }]}>{resultScore}</Text>
        </View>
        <View style={styles.scoreMetric}>
          <Text style={[styles.scoreLabel, { color: colors.textMuted }]}>Placing</Text>
          <Text style={[styles.scoreValue, { color: TRACK_COLOR }]}>{placingScore}</Text>
        </View>
        <View style={styles.scoreMetric}>
          <Text style={[styles.scoreLabel, { color: colors.textMuted }]}>Perf</Text>
          <Text style={[styles.scoreValue, { color: TRACK_COLOR }]}>{performanceScore}</Text>
        </View>
      </View>
    </View>
  );
}

const RANKINGS_STORAGE_KEY = "@rankings_inputs";

type RankingsDraft = {
  event1: string;
  rank1: string;
  place1: string;
  points1: string;
  event2: string;
  rank2: string;
  place2: string;
  points2: string;
};

const EMPTY_RANKINGS_DRAFT: RankingsDraft = {
  event1: "",
  rank1: "",
  place1: "",
  points1: "",
  event2: "",
  rank2: "",
  place2: "",
  points2: "",
};

export default function RankingsScreen() {
  const safePush = useSafePush();
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
  const paintReady = useStableTabPaint();
  // Native tab bar overlays content on Android; keep ranking score / clear fully visible.
  const scrollBottomPadding =
    Platform.OS === "android"
      ? Math.max(FROZEN_INSETS.bottom, scaleSpacing(16)) + scaleSpacing(88)
      : scaleSpacing(32);
  const scrollTopPadding =
    Platform.OS === "web"
      ? scaleSpacing(16)
      : FROZEN_INSETS.top + scaleSpacing(16);
  const [event1, setEvent1] = useState("");
  const [rank1, setRank1] = useState("");
  const [place1, setPlace1] = useState("");
  const [points1, setPoints1] = useState("");

  const [event2, setEvent2] = useState("");
  const [rank2, setRank2] = useState("");
  const [place2, setPlace2] = useState("");
  const [points2, setPoints2] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const skipNextPersist = useRef(false);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(RANKINGS_STORAGE_KEY)
      .then((raw) => {
        if (cancelled || !raw) {
          return;
        }
        try {
          const draft = JSON.parse(raw) as Partial<RankingsDraft>;
          skipNextPersist.current = true;
          if (typeof draft.event1 === "string") setEvent1(draft.event1);
          if (typeof draft.rank1 === "string") setRank1(draft.rank1);
          if (typeof draft.place1 === "string") setPlace1(draft.place1);
          if (typeof draft.points1 === "string") setPoints1(draft.points1);
          if (typeof draft.event2 === "string") setEvent2(draft.event2);
          if (typeof draft.rank2 === "string") setRank2(draft.rank2);
          if (typeof draft.place2 === "string") setPlace2(draft.place2);
          if (typeof draft.points2 === "string") setPoints2(draft.points2);
        } catch {
          // Ignore corrupt drafts.
        }
      })
      .finally(() => {
        if (!cancelled) {
          setHydrated(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    const draft: RankingsDraft = {
      event1,
      rank1,
      place1,
      points1,
      event2,
      rank2,
      place2,
      points2,
    };
    void AsyncStorage.setItem(RANKINGS_STORAGE_KEY, JSON.stringify(draft));
  }, [
    hydrated,
    event1,
    rank1,
    place1,
    points1,
    event2,
    rank2,
    place2,
    points2,
  ]);

  let event1Options = EVENTS;
  let event2Options = EVENTS;
  const event1Obj = EVENTS.find((e) => e.value === event1);
  const event2Obj = EVENTS.find((e) => e.value === event2);

  // Restrict both performances to the same gender once either event is selected.
  if (event1Obj) {
    event2Options = EVENTS.filter((e) => e.gender === event1Obj.gender);
  }
  if (event2Obj) {
    event1Options = EVENTS.filter((e) => e.gender === event2Obj.gender);
  }

  const genderMismatch =
    event1Obj && event2Obj && event1Obj.gender !== event2Obj.gender;

  const resultScore1 = getResultScore(event1, points1);
  const placingScore1 = getPlacingScore(rank1, place1);
  const performanceScore1 = Number(resultScore1) + Number(placingScore1);

  const resultScore2 = getResultScore(event2, points2);
  const placingScore2 = getPlacingScore(rank2, place2);
  const performanceScore2 = Number(resultScore2) + Number(placingScore2);

  const allInputsFilled =
    event1 &&
    rank1 &&
    isValidPlace(place1) &&
    points1 &&
    event2 &&
    rank2 &&
    isValidPlace(place2) &&
    points2 &&
    !genderMismatch;

  const rankingScore = allInputsFilled
    ? Math.floor((performanceScore1 + performanceScore2) / 2)
    : 0;

  const clearAll = () => {
    setEvent1("");
    setRank1("");
    setPlace1("");
    setPoints1("");
    setEvent2("");
    setRank2("");
    setPlace2("");
    setPoints2("");
    void AsyncStorage.setItem(
      RANKINGS_STORAGE_KEY,
      JSON.stringify(EMPTY_RANKINGS_DRAFT)
    );
  };

  const confirmClearAll = () => {
    Alert.alert("Clear all?", "This will clear both performances.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: clearAll },
    ]);
  };

  const scrollContent = (
    <KeyboardDismissScrollView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          opacity: Platform.OS === "web" || paintReady ? 1 : 0,
        },
      ]}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingTop: scrollTopPadding,
          paddingBottom: scrollBottomPadding,
        },
      ]}
    >
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.text }]}>Rankings Calculator</Text>
        {Platform.OS !== "web" && (
          <View style={styles.infoButton}>
            <InfoButton
              onPress={() =>
                safePush({
                  pathname: "/combined-events-explained",
                  params: { section: "rankings" },
                })
              }
            />
          </View>
        )}
        <View style={styles.officialLinks}>
          <Text
            style={styles.officialLink}
            onPress={() => openInNewTab(WORLD_RANKINGS_URLS.men)}
            accessibilityRole="link"
          >
            Men's world rankings
          </Text>
          <Text style={[styles.officialLinkSeparator, { color: colors.textMuted }]}>
            {" · "}
          </Text>
          <Text
            style={styles.officialLink}
            onPress={() => openInNewTab(WORLD_RANKINGS_URLS.women)}
            accessibilityRole="link"
          >
            Women's world rankings
          </Text>
        </View>
      </View>
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
      <View style={styles.rankingTotal}>
        <Text style={[styles.rankingLabel, { color: colors.textSecondary }]}>
          Ranking Score
        </Text>
        {genderMismatch ? (
          <Text style={[styles.rankingError, { color: colors.textSecondary }]}>
            Both performances must be the same gender.
          </Text>
        ) : (
          <Text
            style={[
              styles.rankingValue,
              { color: allInputsFilled ? TRACK_COLOR : colors.text },
            ]}
          >
            {rankingScore}
          </Text>
        )}
      </View>
      <PressableFeedback
        style={[styles.clearButton, actionButtonStyle, buttonElevation(), { backgroundColor: colors.buttonSecondary }]}
        onPress={confirmClearAll}
      >
        <Text style={[styles.clearButtonText, { color: colors.buttonText }]}>Clear</Text>
      </PressableFeedback>
    </KeyboardDismissScrollView>
  );

  return (
    <View style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
      {scrollContent}
    </View>
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
    ...Platform.select({
      web: {
        maxWidth: ScreenLayout.contentMaxWidth,
        alignSelf: "center",
        width: "100%",
      },
    }),
  },
  scrollContent: {
    paddingHorizontal: ScreenLayout.horizontalPadding,
  },
  titleRow: {
    width: "100%",
    position: "relative",
    marginBottom: scaleSpacing(24),
  },
  title: {
    fontSize: scaleFont(28),
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: scaleSpacing(32),
  },
  infoButton: {
    position: "absolute",
    right: 0,
    top: 2,
  },
  officialLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: scaleSpacing(10),
    paddingHorizontal: scaleSpacing(8),
  },
  officialLink: {
    color: TRACK_COLOR,
    fontSize: scaleFont(14),
    fontWeight: "600",
    textAlign: "center",
    ...Platform.select({
      web: { cursor: "pointer" },
    }),
  },
  officialLinkSeparator: {
    fontSize: scaleFont(14),
  },
  performanceSection: {
    width: "100%",
    marginBottom: 0,
  },
  performanceSectionSpaced: {
    marginTop: scaleSpacing(16),
    paddingTop: scaleSpacing(14),
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  performanceTitle: {
    fontSize: scaleFont(13),
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: scaleSpacing(8),
    textAlign: "center",
  },
  dropdown: {
    marginBottom: scaleSpacing(5),
  },
  dropdownText: {
    fontSize: scaleFont(13),
    width: "100%",
    textAlign: "left",
  },
  dropdownPlaceholder: {
    fontSize: scaleFont(13),
    width: "100%",
    textAlign: "left",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scaleSpacing(20),
  },
  modalPanel: {
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    alignItems: "stretch",
  },
  modalHeader: {
    paddingHorizontal: scaleSpacing(14),
    paddingTop: scaleSpacing(10),
    paddingBottom: scaleSpacing(8),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalTitle: {
    fontSize: scaleFont(15),
    fontWeight: "700",
    textAlign: "left",
  },
  modalScrollContent: {
    paddingBottom: scaleSpacing(2),
  },
  modalRow: {
    minHeight: scaleSpacing(36),
    paddingVertical: scaleSpacing(7),
    paddingHorizontal: scaleSpacing(12),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: scaleSpacing(8),
  },
  modalRowMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    minWidth: 0,
  },
  modalCheckSpacer: {
    width: scaleFont(16),
  },
  modalOptionText: {
    fontSize: scaleFont(14),
    flex: 1,
  },
  rankLetter: {
    fontSize: scaleFont(13),
    fontWeight: "700",
    width: scaleSpacing(28),
    textAlign: "left",
    marginRight: scaleSpacing(8),
    flexShrink: 0,
  },
  rankDescription: {
    fontSize: scaleFont(12),
    flex: 1,
    textAlign: "left",
    flexShrink: 1,
    minWidth: 0,
    lineHeight: scaleFont(16),
  },
  inputRow: {
    flexDirection: "row",
    gap: scaleSpacing(8),
    marginBottom: scaleSpacing(8),
  },
  inputHalf: {
    flex: 1,
  },
  inputFullWidth: {
    width: "100%",
  },
  scoreSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scaleSpacing(8),
    marginTop: scaleSpacing(2),
    marginBottom: scaleSpacing(4),
    paddingHorizontal: scaleSpacing(2),
  },
  scoreMetric: {
    flex: 1,
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: scaleFont(11),
    fontWeight: "500",
    marginBottom: scaleSpacing(2),
  },
  scoreValue: {
    fontSize: scaleFont(14),
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  rankingTotal: {
    alignItems: "center",
    marginTop: scaleSpacing(18),
    marginBottom: scaleSpacing(12),
    width: "100%",
  },
  rankingLabel: {
    fontSize: scaleFont(13),
    fontWeight: "600",
    letterSpacing: 0.4,
    textTransform: "uppercase",
    marginBottom: scaleSpacing(4),
  },
  rankingValue: {
    fontSize: scaleFont(36),
    fontWeight: "bold",
    fontVariant: ["tabular-nums"],
  },
  rankingError: {
    fontSize: scaleFont(14),
    textAlign: "center",
    marginTop: scaleSpacing(4),
  },
  clearButton: {
    marginBottom: scaleSpacing(4),
  },
  clearButtonText: {
    fontWeight: "600",
    fontSize: scaleFont(15),
  },
});
