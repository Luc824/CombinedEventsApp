import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CalculatorTitleRow from "../components/calculators/CalculatorTitleRow";
import { ThemeColors } from "../constants/ThemeColors";
import { USE_NATIVE_HEADER } from "../constants/navigation";
import { ScreenLayout, TRACK_COLOR, sectionHeaderStyle } from "../constants/ui";
import { useTheme } from "../contexts/ThemeContext";
import { scaleFont, scaleSpacing } from "../utils/uiScale";

const PAGE_TITLE = "Combined Events explained";

const MEN_EVENT_COLUMNS = [
  {
    title: "Decathlon",
    events: [
      "100m",
      "Long jump",
      "Shot put",
      "High jump",
      "400m",
      "110m hurdles",
      "Discus",
      "Pole vault",
      "Javelin",
      "1500m",
    ],
  },
  {
    title: "Heptathlon",
    events: [
      "60m",
      "Long jump",
      "Shot put",
      "High jump",
      "60m hurdles",
      "Pole vault",
      "1000m",
    ],
  },
] as const;

const WOMEN_EVENT_COLUMNS = [
  {
    title: "Heptathlon",
    events: [
      "100m hurdles",
      "High jump",
      "Shot put",
      "200m",
      "Long jump",
      "Javelin",
      "800m",
    ],
  },
  {
    title: "Pentathlon",
    events: [
      "60m hurdles",
      "High jump",
      "Shot put",
      "Long jump",
      "800m",
    ],
  },
] as const;

const TEXT_SECTIONS = [
  {
    id: "points",
    title: "How points are calculated",
    body: "World Athletics has a scoring table for each event. Each time, distance, or height is worth a certain number of points. Faster, farther, or higher always means more points.\n\nYou score points in races, jumps, and throws. All of them count, and you need all of them. Skipping the 1500m in the decathlon or the 800m in the heptathlon is not a strategy, unfortunately. If an athlete no-heights in the pole vault, or has no valid throw in the shot put, that is zero points.\n\nThis app makes it easy for you to calculate your points for each performance, as well as see your total points.\n\nThe first scoring tables were built so that the world record at the time was worth 1,000 points. The tables have been updated since then, but 1,000 points in a single event is still a world-class mark.",
  },
  {
    id: "winner",
    title: "How someone wins",
    body: "Add up the points from every event. Highest total wins.\n\nYou do not have to win every event. A steady score across the board often beats being brilliant in two events and weak in the rest. A great day one is not enough.",
  },
  {
    id: "rankings",
    title: "World Athletics rankings",
    body: "In combined events, points from every event are added together to give each athlete a competition total. World Athletics rankings are a separate system. They help decide who qualifies for big championships.\n\nA ranking score has two parts. The result score is how good the performance was, based on the points total from that competition. The placing score is determined by which place you finish in the competition, and how big the competition was. Add them together and you get a performance score.\n\nYour ranking uses your two best performance scores and takes the average. For men, at least one of those has to be a decathlon. For women, at least one has to be a heptathlon. Everyone is then ranked by that average.",
  },
] as const;

type EventColumn = {
  title: string;
  events: readonly string[];
};

function EventColumns({
  columns,
  textColor,
}: {
  columns: readonly EventColumn[];
  textColor: string;
}) {
  return (
    <View style={styles.columnsRow}>
      {columns.map((column) => (
        <View key={column.title} style={styles.column}>
          <Text style={[styles.columnTitle, { color: TRACK_COLOR }]}>
            {column.title}
          </Text>
          {column.events.map((event) => (
            <Text
              key={event}
              style={[styles.eventItem, { color: textColor }]}
            >
              {event}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function BodyText({ children, color }: { children: string; color: string }) {
  return <Text style={[styles.body, { color }]}>{children}</Text>;
}

export default function CombinedEventsExplainedScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = ThemeColors[theme];
  const { section } = useLocalSearchParams<{ section?: string }>();
  const scrollRef = useRef<ScrollView>(null);
  const rankingsY = useRef(0);

  useEffect(() => {
    if (section !== "rankings") {
      return;
    }
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: Math.max(rankingsY.current - 16, 0), animated: true });
    }, 250);
    return () => clearTimeout(timer);
  }, [section]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={USE_NATIVE_HEADER ? ["bottom"] : ["top", "bottom"]}
    >
      <StatusBar barStyle={colors.statusBar as any} backgroundColor={colors.background} />
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!USE_NATIVE_HEADER && (
          <CalculatorTitleRow
            title={PAGE_TITLE}
            onBack={() => router.back()}
            showBack
            textColor={colors.text}
            buttonBackground={colors.surfaceSolid}
            buttonBorder={colors.border}
          />
        )}

        <View style={styles.section}>
          <Text style={[styles.heading, { color: TRACK_COLOR }]}>
            What are combined events?
          </Text>
          <BodyText color={colors.text}>
            Combined events is a track and field event that consists of several
            track and field events done by the same athlete, usually over one or
            two days.
          </BodyText>
          <BodyText color={colors.text}>
            Outdoors, men do the decathlon (10 events) and women do the
            heptathlon (7 events). Indoors, men do a heptathlon and women do a
            pentathlon (5 events).
          </BodyText>

          <Text style={[styles.groupLabel, sectionHeaderStyle, { color: colors.textMuted }]}>
            Men's events
          </Text>
          <EventColumns columns={MEN_EVENT_COLUMNS} textColor={colors.text} />

          <Text style={[styles.groupLabel, sectionHeaderStyle, { color: colors.textMuted }]}>
            Women's events
          </Text>
          <EventColumns columns={WOMEN_EVENT_COLUMNS} textColor={colors.text} />

          <BodyText color={colors.text}>
            The winner of the combined events competition at the Olympics or the
            World Championships is often called the world's greatest athlete.
            That goes back to 1912, when the King of Sweden told Olympic
            champion Jim Thorpe he was the greatest athlete in the world.
          </BodyText>
          <BodyText color={colors.text}>
            It is a hard title to earn. The same athlete has to sprint, jump,
            and throw, then come back the next day and do it again. For the
            decathlon, day two starts with hurdles. The legs do not get a vote.
          </BodyText>
        </View>

        {TEXT_SECTIONS.map((item) => (
          <View
            key={item.id}
            style={styles.section}
            onLayout={
              item.id === "rankings"
                ? (event) => {
                    rankingsY.current = event.nativeEvent.layout.y;
                  }
                : undefined
            }
          >
            <Text style={[styles.heading, { color: TRACK_COLOR }]}>{item.title}</Text>
            <BodyText color={colors.text}>{item.body}</BodyText>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    ...Platform.select({
      web: { alignItems: "center" },
    }),
  },
  scrollView: {
    flex: 1,
    ...Platform.select({
      web: { maxWidth: ScreenLayout.contentMaxWidth, width: "100%" },
    }),
  },
  scrollContent: {
    paddingHorizontal: ScreenLayout.horizontalPadding,
    paddingTop: Platform.OS === "web" ? scaleSpacing(8) : scaleSpacing(12),
    paddingBottom: scaleSpacing(40),
  },
  section: {
    marginBottom: scaleSpacing(28),
  },
  heading: {
    fontSize: scaleFont(18),
    fontWeight: "700",
    marginBottom: scaleSpacing(8),
  },
  body: {
    fontSize: scaleFont(16),
    lineHeight: scaleSpacing(24),
    marginBottom: scaleSpacing(12),
  },
  groupLabel: {
    marginTop: scaleSpacing(4),
    marginBottom: scaleSpacing(6),
  },
  columnsRow: {
    flexDirection: "row",
    gap: scaleSpacing(12),
    marginBottom: scaleSpacing(12),
  },
  column: {
    flex: 1,
    minWidth: 0,
  },
  columnTitle: {
    fontSize: scaleFont(14),
    fontWeight: "700",
    marginBottom: scaleSpacing(6),
  },
  eventItem: {
    fontSize: scaleFont(14),
    lineHeight: scaleSpacing(20),
    marginBottom: scaleSpacing(2),
  },
});
