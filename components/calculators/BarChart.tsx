import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Radius } from "../../constants/ui";
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

const BAR_AREA_HEIGHT = scaleSpacing(140);
const VALUE_AREA_HEIGHT = scaleSpacing(20);
const LABEL_AREA_HEIGHT = scaleSpacing(28);

function getDensity(eventCount: number) {
  if (eventCount >= 10) {
    return {
      valueBase: scaleFont(8),
      valueFourDigit: scaleFont(7),
      labelSize: scaleFont(7),
      barMaxWidth: scaleSpacing(22),
      labelLines: 2 as const,
    };
  }
  if (eventCount >= 7) {
    return {
      valueBase: scaleFont(9),
      valueFourDigit: scaleFont(8),
      labelSize: scaleFont(8),
      barMaxWidth: scaleSpacing(26),
      labelLines: 2 as const,
    };
  }
  return {
    valueBase: scaleFont(10),
    valueFourDigit: scaleFont(9),
    labelSize: scaleFont(9),
    barMaxWidth: scaleSpacing(30),
    labelLines: 1 as const,
  };
}

function valueFontSize(pointValue: number, density: ReturnType<typeof getDensity>): number {
  const digits = String(pointValue).length;
  return digits >= 4 ? density.valueFourDigit : density.valueBase;
}

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
  const safePoints = points.map((point) =>
    Number.isFinite(point) && point > 0 ? point : 0
  );
  const maxPoints = Math.max(...safePoints, 1000);
  const density = getDensity(safePoints.length);
  const labelHeight = Math.max(
    scaleSpacing(barLabelContainerHeight),
    LABEL_AREA_HEIGHT
  );

  return (
    <View style={[styles.chartContainer, { backgroundColor }]}>
      <Text style={[styles.chartTitle, { color: textColor }]}>
        Performance Overview
      </Text>
      <View style={styles.chartRow}>
        {safePoints.map((pointValue, index) => {
          const barHeight =
            maxPoints > 0 ? (pointValue / maxPoints) * BAR_AREA_HEIGHT : 0;
          const label = eventLabels[index] ?? "";
          const isLongLabel =
            barLabelSmallFontSize !== undefined && label.length > longLabelLength;
          const labelFontSize = isLongLabel
            ? Math.min(scaleFont(barLabelSmallFontSize!), density.labelSize)
            : Math.min(scaleFont(barLabelFontSize), density.labelSize);

          return (
            <View key={index} style={styles.barColumn}>
              <View style={[styles.valueArea, { height: VALUE_AREA_HEIGHT }]}>
                <Text
                  style={[
                    styles.barValue,
                    {
                      color: textColor,
                      fontSize: valueFontSize(pointValue, density),
                    },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}
                >
                  {pointValue}
                </Text>
              </View>
              <View style={[styles.barArea, { height: BAR_AREA_HEIGHT }]}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: density.barMaxWidth,
                      maxWidth: "85%",
                      height: Math.max(barHeight, 2),
                      backgroundColor: trackColor,
                    },
                  ]}
                />
              </View>
              <View style={[styles.labelArea, { height: labelHeight }]}>
                <Text
                  style={[
                    styles.barLabel,
                    { color: textColor, fontSize: labelFontSize },
                  ]}
                  numberOfLines={density.labelLines}
                  adjustsFontSizeToFit
                  minimumFontScale={0.5}
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
    borderRadius: Radius.md,
    paddingVertical: scaleSpacing(12),
    paddingHorizontal: scaleSpacing(8),
    overflow: "hidden",
    width: "100%",
  },
  chartTitle: {
    fontSize: scaleFont(16),
    fontWeight: "bold",
    marginBottom: scaleSpacing(10),
    textAlign: "center",
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    width: "100%",
  },
  barColumn: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    paddingHorizontal: scaleSpacing(1),
  },
  valueArea: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  barValue: {
    fontWeight: "600",
    textAlign: "center",
    width: "100%",
    lineHeight: scaleFont(11),
    ...Platform.select({
      web: {
        overflow: "hidden" as any,
        textOverflow: "clip" as any,
      },
    }),
  },
  barArea: {
    width: "100%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bar: {
    borderRadius: scaleSpacing(3),
    minHeight: 2,
  },
  labelArea: {
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: scaleSpacing(4),
  },
  barLabel: {
    textAlign: "center",
    width: "100%",
    lineHeight: scaleFont(10),
  },
});
