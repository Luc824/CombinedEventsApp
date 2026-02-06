import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
    marginTop: 8,
    alignItems: "center",
    paddingVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
  },
  totalText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  resultScoreText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
