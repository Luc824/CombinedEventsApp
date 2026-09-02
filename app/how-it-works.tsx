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
import { ScreenLayout, TRACK_COLOR } from "../constants/ui";
import { useTheme } from "../contexts/ThemeContext";
import { scaleFont, scaleSpacing } from "../utils/uiScale";

const SECTIONS = [
  {
    id: "what",
    title: "What are combined events?",
    body: "Combined events is a track and field event that consists of several track and field events done by the same athlete, usually over one or two days.\n\nOutdoors, men do the decathlon (10 events) and women do the heptathlon (7 events). Indoors, men do a heptathlon and women do a pentathlon (5 events).\n\nThe winner of the combined events competition at the Olympics or the World Championships is often called the world's greatest athlete. That goes back to 1912, when the King of Sweden told Olympic champion Jim Thorpe he was the greatest athlete in the world.\n\nIt is a hard title to earn. The same athlete has to sprint, jump, and throw, then come back the next day and do it again.",
  },
  {
    id: "points",
    title: "How points are calculated",
    body: "World Athletics has a scoring table for each event. Each time, distance, or height is worth a certain number of points. Faster, farther, or higher always means more points.\n\nYou score points in races, jumps, and throws. All of them count, and you need all of them. If an athlete no-heights in the pole vault, or has no valid throw in the discus, that is zero points. There is no catching up. The athlete has no way of winning.\n\nOpening height is not a warm-up. Skipping the 1500m is not a strategy, unfortunately.\n\nThis app makes it easy to get the points for each event, and your total.\n\nThe first scoring tables were built so that the world record at the time was worth 1,000 points. That idea stuck. The tables have been updated since then, but about 1,000 points in a single event is still a world-class mark.",
  },
  {
    id: "winner",
    title: "How someone wins",
    body: "Add up the points from every event. Highest total wins.\n\nYou do not have to win every event. A steady score across the board often beats being brilliant in two events and weak in the rest.\n\nA great day one is not enough. Day two starts with hurdles. The legs do not get a vote. In the heptathlon, the 800m at the end is not optional either.",
  },
  {
    id: "rankings",
    title: "World Athletics rankings",
    body: "That total decides who wins a combined events competition. World rankings are a separate system. They help decide who qualifies for big championships.\n\nA ranking score has two parts. The result score is how good the performance was, based on the points total. The placing score is where you finished, and how big the competition was. Add them together and you get a performance score.\n\nYour ranking uses your two best performance scores and takes the average. For men, at least one of those has to be a decathlon. For women, at least one has to be a heptathlon. Everyone is then ranked by that average.",
  },
] as const;

export default function HowItWorksScreen() {
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
            title="How It Works"
            onBack={() => router.back()}
            showBack
            textColor={colors.text}
            buttonBackground={colors.surfaceSolid}
            buttonBorder={colors.border}
          />
        )}

        {SECTIONS.map((item) => (
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
            <Text style={[styles.body, { color: colors.text }]}>{item.body}</Text>
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
  },
});
