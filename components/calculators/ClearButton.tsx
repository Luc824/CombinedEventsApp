import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
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
  return (
    <TouchableOpacity
      style={[styles.clearButton, actionButtonStyle, buttonElevation(), { backgroundColor }]}
      onPress={onPress}
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
