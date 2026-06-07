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
import { scaleFont, scaleSpacing } from "../../utils/uiScale";

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
    maxWidth: scaleSpacing(400),
    maxHeight: "90%",
  },
  modalScrollView: {
    width: "100%",
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: scaleSpacing(20),
  },
  modalContent: {
    borderRadius: scaleSpacing(16),
    padding: scaleSpacing(20),
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scaleSpacing(16),
  },
  modalTitle: {
    fontSize: scaleFont(22),
    fontWeight: "bold",
  },
  closeButton: {
    width: scaleSpacing(30),
    height: scaleSpacing(30),
    borderRadius: scaleSpacing(15),
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
  },
  totalScoreCard: {
    borderRadius: scaleSpacing(12),
    padding: scaleSpacing(16),
    alignItems: "center",
    marginBottom: scaleSpacing(20),
  },
  totalScoreLabel: {
    fontSize: scaleFont(14),
    marginBottom: scaleSpacing(4),
  },
  totalScoreValue: {
    fontSize: scaleFont(32),
    fontWeight: "bold",
    marginBottom: scaleSpacing(2),
  },
  totalScoreUnit: {
    fontSize: scaleFont(14),
  },
});
