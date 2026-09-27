import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
import { actionButtonStyle, buttonElevation } from "../../constants/ui";
import { scaleFont, scaleSpacing } from "../../utils/uiScale";

type ClearButtonProps = {
  onPress: () => void;
  backgroundColor: string;
  textColor: string;
};

export default function ClearButton({
  onPress,
  backgroundColor,
  textColor,
}: ClearButtonProps) {
  const handlePress = () => {
    Alert.alert("Clear all?", "This will clear all results and points.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress },
    ]);
  };

  return (
    <TouchableOpacity
      style={[styles.clearButton, actionButtonStyle, buttonElevation(), { backgroundColor }]}
      onPress={handlePress}
    >
      <Text style={[styles.clearButtonText, { color: textColor }]}>Clear</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  clearButton: {
    marginVertical: scaleSpacing(8),
    marginHorizontal: scaleSpacing(16),
  },
  clearButtonText: {
    fontWeight: "600",
    fontSize: scaleFont(15),
  },
});
