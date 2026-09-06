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
  pointsValue: string;
  onPointsChange: (text: string) => void;
  onPointsBlur: () => void;
  placeholder: string;
  maxLength: number;
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
  pointsValue,
  onPointsChange,
  onPointsBlur,
  placeholder,
  maxLength,
  textColor,
  inputBackground,
  inputText,
  inputBorder,
  containerBackground,
  containerBorder,
  placeholderColor,
}: EventInputRowProps) {
  const displayPoints = pointsValue ? parseInt(pointsValue, 10) : 0;
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
        selectTextOnFocus
        textContentType="none"
        autoComplete="off"
        importantForAutofill="no"
        autoCorrect={false}
        spellCheck={false}
      />
      <View style={styles.pointsWrap}>
        <TextInput
          style={[
            styles.pointsInput,
            {
              color: textColor,
              fontSize: pointsFontSize(displayPoints),
              borderColor: inputBorder,
            },
            isWeb && styles.pointsInputWeb,
          ]}
          value={pointsValue}
          onChangeText={onPointsChange}
          onBlur={onPointsBlur}
          onEndEditing={onPointsBlur}
          keyboardType="number-pad"
          inputMode="numeric"
          placeholder="0"
          placeholderTextColor={placeholderColor}
          maxLength={4}
          selectTextOnFocus
          textContentType="none"
          autoComplete="off"
          importantForAutofill="no"
          autoCorrect={false}
          spellCheck={false}
        />
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
  pointsInput: {
    fontWeight: "700",
    textAlign: "right",
    minWidth: scaleSpacing(34),
    maxWidth: scaleSpacing(42),
    paddingVertical: 0,
    paddingHorizontal: scaleSpacing(2),
    ...Platform.select({
      web: {
        outlineStyle: "none" as any,
      },
    }),
  },
  pointsInputWeb: {
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
