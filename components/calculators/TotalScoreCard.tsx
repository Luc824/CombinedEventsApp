import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { Radius } from "../../constants/ui";
import { CRAFT_FEEDBACK_ENABLED } from "../../utils/craftFeedback";
import { scaleFont, scaleSpacing } from "../../utils/uiScale";

type TotalScoreCardProps = {
  totalScore: number;
  resultScore: string;
  textColor: string;
  trackColor: string;
  backgroundColor: string;
  borderColor: string;
};

export default function TotalScoreCard({
  totalScore,
  resultScore,
  textColor,
  trackColor,
  backgroundColor,
  borderColor,
}: TotalScoreCardProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const prevScore = useRef(totalScore);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      prevScore.current = totalScore;
      return;
    }
    if (!CRAFT_FEEDBACK_ENABLED || totalScore === prevScore.current) {
      prevScore.current = totalScore;
      return;
    }
    prevScore.current = totalScore;
    scale.setValue(1);
    Animated.sequence([
      Animated.spring(scale, {
        toValue: 1.03,
        friction: 6,
        tension: 220,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [totalScore, scale]);

  return (
    <Animated.View
      style={[
        styles.totalContainer,
        { backgroundColor, borderColor, transform: [{ scale }] },
      ]}
    >
      <Text style={[styles.totalText, { color: textColor }]}>
        Total Score: {totalScore} Points
      </Text>
      <Text style={[styles.resultScoreText, { color: trackColor }]}>
        Result Score: {resultScore}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  totalContainer: {
    marginTop: scaleSpacing(8),
    alignItems: "center",
    paddingVertical: scaleSpacing(8),
    marginHorizontal: scaleSpacing(16),
    borderWidth: 1,
    borderRadius: Radius.md,
    marginBottom: scaleSpacing(12),
  },
  totalText: {
    fontSize: scaleFont(24),
    fontWeight: "bold",
    marginBottom: scaleSpacing(5),
  },
  resultScoreText: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
  },
});
