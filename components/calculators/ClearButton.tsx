import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

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
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  clearButtonText: {
    fontWeight: "600",
    fontSize: 15,
  },
});
