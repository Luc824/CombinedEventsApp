import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { scaleFont, scaleSpacing } from "../../utils/uiScale";

type BarChartProps = {
  points: number[];
  eventLabels: string[];
  trackColor: string;
  textColor: string;
  backgroundColor: string;
  barLabelContainerHeight: number;
  barLabelFontSize: number;
  barLabelSmallFontSize?: number;
  longLabelLength?: number;
};

export default function BarChart({
  points,
  eventLabels,
  trackColor,
  textColor,
  backgroundColor,
  barLabelContainerHeight,
  barLabelFontSize,
  barLabelSmallFontSize,
  longLabelLength = 4,
}: BarChartProps) {
  const maxPoints = Math.max(...points, 1000);
  const chartHeight = scaleSpacing(200);
  const barWidth = scaleSpacing(22);
  const barSpacing = scaleSpacing(4);

  return (
    <View style={[styles.chartContainer, { backgroundColor }]}>
      <Text style={[styles.chartTitle, { color: textColor }]}>
        Performance Overview
      </Text>
      <View style={styles.chartContent}>
        {points.map((pointValue, index) => {
          const barHeight =
            maxPoints > 0 ? (pointValue / maxPoints) * chartHeight : 0;
          const label = eventLabels[index] ?? "";
          const isLongLabel =
            barLabelSmallFontSize !== undefined &&
            label.length > longLabelLength;

          return (
            <View
              key={index}
              style={[styles.barWrapper, { width: barWidth + barSpacing * 2 }]}
            >
              <Text style={[styles.barValue, { color: textColor }]}>
                {pointValue}
              </Text>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: barWidth,
                      height: Math.max(barHeight, 2),
                      backgroundColor: trackColor,
                    },
                  ]}
                />
              </View>
              <View
                style={[
                  styles.barLabelContainer,
                  { height: scaleSpacing(barLabelContainerHeight) },
                ]}
              >
                <Text
                  style={[
                    styles.barLabel,
                    { color: textColor, fontSize: scaleFont(barLabelFontSize) },
                    isLongLabel && barLabelSmallFontSize !== undefined
                      ? { fontSize: scaleFont(barLabelSmallFontSize) }
                      : null,
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.8}
                >
                  {label}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    borderRadius: scaleSpacing(12),
    padding: scaleSpacing(16),
  },
  chartTitle: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    marginBottom: scaleSpacing(16),
    textAlign: "center",
  },
  chartContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: scaleSpacing(240),
    paddingHorizontal: scaleSpacing(8),
  },
  barWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  barValue: {
    fontSize: scaleFont(12),
    fontWeight: "600",
    marginBottom: scaleSpacing(4),
    textAlign: "center",
  },
  barContainer: {
    width: "100%",
    height: scaleSpacing(200),
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bar: {
    borderRadius: scaleSpacing(4),
    minHeight: 2,
  },
  barLabelContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: scaleSpacing(6),
  },
  barLabel: {
    textAlign: "center",
    width: "100%",
  },
});
