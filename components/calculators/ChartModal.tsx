import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import BarChart from "./BarChart";

type ChartModalProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  totalPoints: number;
  points: number[];
  eventLabels: string[];
  trackColor: string;
  textColor: string;
  secondaryTextColor: string;
  backgroundColor: string;
  surfaceColor: string;
  overlayColor: string;
  barLabelContainerHeight: number;
  barLabelFontSize: number;
  barLabelSmallFontSize?: number;
  longLabelLength?: number;
};

export default function ChartModal({
  visible,
  onClose,
  title,
  totalPoints,
  points,
  eventLabels,
  trackColor,
  textColor,
  secondaryTextColor,
  backgroundColor,
  surfaceColor,
  overlayColor,
  barLabelContainerHeight,
  barLabelFontSize,
  barLabelSmallFontSize,
  longLabelLength,
}: ChartModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: overlayColor }]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContentWrapper}>
          <ScrollView
            contentContainerStyle={styles.modalScrollContent}
            style={styles.modalScrollView}
          >
            <View style={[styles.modalContent, { backgroundColor }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: textColor }]}>
                  {title}
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  style={[styles.closeButton, { backgroundColor: surfaceColor }]}
                >
                  <Text style={[styles.closeButtonText, { color: textColor }]}>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.totalScoreCard, { backgroundColor: surfaceColor }]}>
                <Text style={[styles.totalScoreLabel, { color: secondaryTextColor }]}>
                  Total Score
                </Text>
                <Text style={[styles.totalScoreValue, { color: textColor }]}>
                  {totalPoints}
                </Text>
                <Text style={[styles.totalScoreUnit, { color: textColor }]}>
                  Points
                </Text>
              </View>
              <BarChart
                points={points}
                eventLabels={eventLabels}
                trackColor={trackColor}
                textColor={textColor}
                backgroundColor={surfaceColor}
                barLabelContainerHeight={barLabelContainerHeight}
                barLabelFontSize={barLabelFontSize}
                barLabelSmallFontSize={barLabelSmallFontSize}
                longLabelLength={longLabelLength}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContentWrapper: {
    position: "absolute",
    width: "90%",
    maxWidth: 400,
    maxHeight: "90%",
  },
  modalScrollView: {
    width: "100%",
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalScoreCard: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 20,
  },
  totalScoreLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  totalScoreValue: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 2,
  },
  totalScoreUnit: {
    fontSize: 14,
  },
});
