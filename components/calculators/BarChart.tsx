import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
  const chartHeight = 200;
  const barWidth = 22;
  const barSpacing = 4;

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
                  { height: barLabelContainerHeight },
                ]}
              >
                <Text
                  style={[
                    styles.barLabel,
                    { color: textColor, fontSize: barLabelFontSize },
                    isLongLabel && { fontSize: barLabelSmallFontSize },
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
    borderRadius: 12,
    padding: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  chartContent: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 240,
    paddingHorizontal: 8,
  },
  barWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  barValue: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  barContainer: {
    width: "100%",
    height: 200,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bar: {
    borderRadius: 4,
    minHeight: 2,
  },
  barLabelContainer: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 6,
  },
  barLabel: {
    textAlign: "center",
    width: "100%",
  },
});
