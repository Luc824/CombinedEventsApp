import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
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
  return (
    <TouchableOpacity
      style={[styles.clearButton, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={[styles.clearButtonText, { color: textColor }]}>Clear</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  clearButton: {
    borderRadius: scaleSpacing(12),
    paddingVertical: scaleSpacing(12),
    paddingHorizontal: scaleSpacing(24),
    alignItems: "center",
    marginVertical: scaleSpacing(8),
    marginHorizontal: scaleSpacing(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clearButtonText: {
    fontWeight: "600",
    fontSize: scaleFont(15),
  },
});
