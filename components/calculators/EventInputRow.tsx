import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Radius, formFieldStyle } from "../../constants/ui";
import { scaleFont, scaleSpacing } from "../../utils/uiScale";

type EventInputRowProps = {
  eventName: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  maxLength: number;
  points: number;
  textColor: string;
  inputBackground: string;
  inputText: string;
  inputBorder: string;
  containerBackground: string;
  containerBorder: string;
  placeholderColor: string;
};

function pointsFontSize(value: number): number {
  const digits = String(Math.abs(value)).length;
  if (digits >= 4) return scaleFont(10);
  if (digits >= 3) return scaleFont(11);
  return scaleFont(13);
}

export default function EventInputRow({
  eventName,
  value,
  onChangeText,
  placeholder,
  maxLength,
  points,
  textColor,
  inputBackground,
  inputText,
  inputBorder,
  containerBackground,
  containerBorder,
  placeholderColor,
}: EventInputRowProps) {
  const displayPoints = Number.isFinite(points) ? points : 0;
  const isWeb = Platform.OS === "web";

  return (
    <View
      style={[
        styles.eventContainer,
        { backgroundColor: containerBackground, borderColor: containerBorder },
      ]}
    >
      <Text style={[styles.eventName, { color: textColor }]} numberOfLines={2}>
        {eventName}
      </Text>
      <TextInput
        style={[
          styles.input,
          formFieldStyle,
          {
            backgroundColor: inputBackground,
            color: inputText,
            borderColor: inputBorder,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        keyboardType="number-pad"
        inputMode="numeric"
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        maxLength={maxLength}
      />
      <View style={styles.pointsWrap}>
        <Text
          style={[
            styles.pointsValue,
            { color: textColor, fontSize: pointsFontSize(displayPoints) },
            isWeb && styles.pointsValueWeb,
          ]}
          {...(isWeb
            ? {}
            : {
                numberOfLines: 1,
                adjustsFontSizeToFit: true,
                minimumFontScale: 0.75,
              })}
        >
          {displayPoints}
        </Text>
        <Text style={[styles.pointsSuffix, { color: textColor }]}>pts</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eventContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: scaleSpacing(3),
    marginHorizontal: scaleSpacing(16),
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingVertical: scaleSpacing(4),
    paddingHorizontal: scaleSpacing(4),
  },
  eventName: {
    fontSize: scaleFont(13),
    flex: 1,
    marginRight: scaleSpacing(4),
    lineHeight: scaleFont(16),
  },
  input: {
    width: scaleSpacing(76),
    marginRight: scaleSpacing(4),
    textAlign: "right",
    flexShrink: 0,
    ...Platform.select({
      web: {
        outlineStyle: "none" as any,
      },
    }),
  },
  pointsWrap: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-end",
    minWidth: scaleSpacing(64),
    maxWidth: scaleSpacing(72),
    flexShrink: 0,
    gap: scaleSpacing(2),
  },
  pointsValue: {
    fontWeight: "700",
    textAlign: "right",
  },
  pointsValueWeb: {
    flexShrink: 1,
    ...Platform.select({
      web: {
        whiteSpace: "nowrap" as any,
      },
    }),
  },
  pointsSuffix: {
    fontSize: scaleFont(11),
    fontWeight: "600",
    opacity: 0.85,
    flexShrink: 0,
  },
});
