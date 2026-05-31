import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { actionButtonStyle, buttonElevation } from "../../constants/ui";
import { scaleFont, scaleSpacing } from "../../utils/uiScale";

type ActionButtonsRowProps = {
  onViewChart: () => void;
  onSaveScore: () => void;
  showSaveButton?: boolean;
  buttonBackground: string;
  buttonTextColor: string;
};

export default function ActionButtonsRow({
  onViewChart,
  onSaveScore,
  showSaveButton = Platform.OS !== "web",
  buttonBackground,
  buttonTextColor,
}: ActionButtonsRowProps) {
  return (
    <View style={styles.buttonRow}>
      <TouchableOpacity
        style={[styles.actionButton, actionButtonStyle, buttonElevation(), { backgroundColor: buttonBackground }]}
        onPress={onViewChart}
      >
        <Text style={[styles.actionButtonText, { color: buttonTextColor }]}>
          View Chart
        </Text>
      </TouchableOpacity>
      {showSaveButton && (
        <TouchableOpacity
          style={[styles.actionButton, actionButtonStyle, buttonElevation(), { backgroundColor: buttonBackground }]}
          onPress={onSaveScore}
        >
          <Text style={[styles.actionButtonText, { color: buttonTextColor }]}>
            Save Score
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scaleSpacing(10),
    marginVertical: scaleSpacing(6),
    marginHorizontal: scaleSpacing(16),
  },
  actionButton: {
    flex: 1,
    minWidth: scaleSpacing(140),
  },
  actionButtonText: {
    fontWeight: "600",
    fontSize: scaleFont(15),
  },
});
