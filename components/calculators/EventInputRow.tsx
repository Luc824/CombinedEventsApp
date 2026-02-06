import React from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";

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
          {
            backgroundColor: inputBackground,
            color: inputText,
            borderWidth: 1,
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
    marginBottom: 3,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  eventName: {
    fontSize: 13,
    flex: 1,
    marginRight: 5,
  },
  input: {
    width: 80,
    height: 28,
    borderWidth: 0,
    borderRadius: 20,
    paddingHorizontal: 8,
    marginRight: 5,
    fontSize: 13,
    textAlign: "right",
    ...Platform.select({
      android: {
        height: 30,
        paddingVertical: 0,
        textAlignVertical: "center",
      },
    }),
  },
  points: {
    fontSize: 13,
    fontWeight: "bold",
    width: 90,
    textAlign: "right",
  },
});
