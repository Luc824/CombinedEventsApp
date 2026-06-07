import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Radius, actionButtonStyle, buttonElevation } from "../../constants/ui";
import { scaleFont, scaleSpacing } from "../../utils/uiScale";

type SaveScoreModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  setTitle: (text: string) => void;
  backgroundColor: string;
  overlayColor: string;
  textColor: string;
  secondaryTextColor: string;
  placeholderColor: string;
  inputBackground: string;
  inputText: string;
  inputBorder: string;
  primaryButtonColor: string;
  secondaryButtonColor: string;
  buttonTextColor: string;
};

export default function SaveScoreModal({
  visible,
  onClose,
  onSave,
  title,
  setTitle,
  backgroundColor,
  overlayColor,
  textColor,
  secondaryTextColor,
  placeholderColor,
  inputBackground,
  inputText,
  inputBorder,
  primaryButtonColor,
  secondaryButtonColor,
  buttonTextColor,
}: SaveScoreModalProps) {
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
        <View style={[styles.saveModalContent, { backgroundColor }]}>
          <Text style={[styles.saveModalTitle, { color: textColor }]}>
            Save Score
          </Text>
          <Text style={[styles.saveModalSubtitle, { color: secondaryTextColor }]}>
            Enter a title for this score
          </Text>
          <TextInput
            style={[
              styles.saveModalInput,
              { backgroundColor: inputBackground, color: inputText, borderColor: inputBorder },
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., My Personal Best"
            placeholderTextColor={placeholderColor}
            autoFocus
            maxLength={50}
          />
          <View style={styles.saveModalButtons}>
            <TouchableOpacity
              style={[styles.saveModalButton, actionButtonStyle, buttonElevation(), { backgroundColor: secondaryButtonColor }]}
              onPress={onClose}
            >
              <Text style={[styles.saveModalButtonText, { color: buttonTextColor }]}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveModalButton, actionButtonStyle, buttonElevation(), { backgroundColor: primaryButtonColor }]}
              onPress={onSave}
            >
              <Text style={[styles.saveModalButtonText, { color: buttonTextColor }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
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
  saveModalContent: {
    borderRadius: Radius.lg,
    padding: scaleSpacing(20),
    width: "85%",
    maxWidth: scaleSpacing(400),
    alignSelf: "center",
  },
  saveModalTitle: {
    fontSize: scaleFont(22),
    fontWeight: "bold",
    marginBottom: scaleSpacing(8),
    textAlign: "center",
  },
  saveModalSubtitle: {
    fontSize: scaleFont(14),
    marginBottom: scaleSpacing(16),
    textAlign: "center",
  },
  saveModalInput: {
    borderRadius: Radius.sm,
    padding: scaleSpacing(12),
    fontSize: scaleFont(16),
    marginBottom: scaleSpacing(20),
    borderWidth: 1,
  },
  saveModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scaleSpacing(12),
  },
  saveModalButton: {
    flex: 1,
  },
  saveModalButtonText: {
    fontWeight: "600",
    fontSize: scaleFont(16),
  },
});
