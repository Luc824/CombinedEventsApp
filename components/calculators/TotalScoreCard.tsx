import React from "react";
import { StyleSheet, Text, View } from "react-native";
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
  return (
    <View
      style={[
        styles.totalContainer,
        { backgroundColor, borderColor },
      ]}
    >
      <Text style={[styles.totalText, { color: textColor }]}>
        Total Score: {totalScore} Points
      </Text>
      <Text style={[styles.resultScoreText, { color: trackColor }]}>
        Result Score: {resultScore}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  totalContainer: {
    marginTop: scaleSpacing(8),
    alignItems: "center",
    paddingVertical: scaleSpacing(8),
    marginHorizontal: scaleSpacing(16),
    borderWidth: 1,
    borderRadius: scaleSpacing(10),
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
