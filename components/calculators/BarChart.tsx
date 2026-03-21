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
  /** Decathlon (10 events): tighter gap + slightly wider columns so 4-digit labels fit without ellipsis. */
  const denseDecathlon = points.length >= 10;
  const barWidth = scaleSpacing(denseDecathlon ? 26 : 22);
  const barSpacing = scaleSpacing(denseDecathlon ? 2 : 4);

  return (
    <View style={[styles.chartContainer, { backgroundColor }]}>
      <Text style={[styles.chartTitle, { color: textColor }]}>
        Performance Overview
      </Text>
      <View
        style={
          denseDecathlon
            ? [styles.chartContentDense, { gap: barSpacing }]
            : styles.chartContent
        }
      >
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
              style={[
                styles.barWrapper,
                {
                  width: denseDecathlon
                    ? barWidth
                    : barWidth + barSpacing * 2,
                },
              ]}
            >
              <Text
                style={[
                  styles.barValue,
                  denseDecathlon && styles.barValueDense,
                  { color: textColor },
                ]}
                numberOfLines={1}
              >
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
  chartContentDense: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    height: scaleSpacing(240),
    paddingHorizontal: scaleSpacing(14),
    width: "100%",
  },
  barWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  /** Heptathlon / pentathlon: room for 4 digits at one size. */
  barValue: {
    fontSize: scaleFont(10),
    fontWeight: "600",
    marginBottom: scaleSpacing(4),
    textAlign: "center",
    width: "100%",
  },
  /** Decathlon: 10 narrow columns — one step smaller so 4-digit scores fit without "10…" ellipsis (same size for every bar). */
  barValueDense: {
    fontSize: scaleFont(9),
    letterSpacing: -0.25,
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
