import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
    gap: 10,
    marginVertical: 6,
    marginHorizontal: 16,
  },
  chartButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minWidth: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chartButtonText: {
    fontWeight: "600",
    fontSize: 15,
  },
  saveButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minWidth: 140,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  saveButtonText: {
    fontWeight: "600",
    fontSize: 15,
  },
});
