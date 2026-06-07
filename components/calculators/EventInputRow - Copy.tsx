import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
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
  return (
    <View
      style={[
        styles.eventContainer,
        { backgroundColor: containerBackground, borderColor: containerBorder },
      ]}
    >
      <Text style={[styles.eventName, { color: textColor }]}>{eventName}</Text>
      <TextInput
        style={[
          styles.input,
          formFieldStyle,
          {
            backgroundColor: inputBackground,
            color: inputText,
            borderWidth: 0,
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
      <Text style={[styles.points, { color: textColor }]}>{points} Points</Text>
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
    marginRight: scaleSpacing(5),
  },
  input: {
    width: scaleSpacing(80),
    marginRight: scaleSpacing(5),
    textAlign: "right",
  },
  points: {
    fontSize: scaleFont(13),
    fontWeight: "bold",
    width: scaleSpacing(90),
    textAlign: "right",
  },
});
