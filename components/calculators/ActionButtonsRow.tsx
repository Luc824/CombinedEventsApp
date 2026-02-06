import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
        style={[styles.chartButton, { backgroundColor: buttonBackground }]}
        onPress={onViewChart}
      >
        <Text style={[styles.chartButtonText, { color: buttonTextColor }]}>
          View Chart
        </Text>
      </TouchableOpacity>
      {showSaveButton && (
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: buttonBackground }]}
          onPress={onSaveScore}
        >
          <Text style={[styles.saveButtonText, { color: buttonTextColor }]}>
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
  chartButton: {
    borderRadius: scaleSpacing(12),
    paddingVertical: scaleSpacing(12),
    paddingHorizontal: scaleSpacing(20),
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minWidth: scaleSpacing(140),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartButtonText: {
    fontWeight: "600",
    fontSize: scaleFont(15),
  },
  saveButton: {
    borderRadius: scaleSpacing(12),
    paddingVertical: scaleSpacing(12),
    paddingHorizontal: scaleSpacing(20),
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minWidth: scaleSpacing(140),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    fontWeight: "600",
    fontSize: scaleFont(15),
  },
});
