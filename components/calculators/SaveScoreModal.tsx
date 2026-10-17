import React, { useEffect, useRef } from "react";
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import PressableFeedback from "../PressableFeedback";
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
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const inputRef = useRef<TextInput>(null);

  // Sit above the keyboard, but closer to mid-screen than the top edge.
  const topInset = Math.max(
    scaleSpacing(88),
    Math.min(windowHeight * 0.2, scaleSpacing(168))
  );
  const modalWidth = Math.min(windowWidth * 0.88, scaleSpacing(400));

  // Focus after the modal is on screen so autofocus doesn't fight appearance.
  useEffect(() => {
    if (!visible) {
      return;
    }
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 40);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      presentationStyle={Platform.OS === "ios" ? "overFullScreen" : undefined}
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: overlayColor }]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
        <View
          style={[
            styles.saveModalContent,
            {
              backgroundColor,
              marginTop: topInset,
              width: modalWidth,
            },
          ]}
        >
          <Text style={[styles.saveModalTitle, { color: textColor }]}>
            Save Score
          </Text>
          <Text style={[styles.saveModalSubtitle, { color: secondaryTextColor }]}>
            Enter a title for this score
          </Text>
          <TextInput
            ref={inputRef}
            style={[
              styles.saveModalInput,
              {
                backgroundColor: inputBackground,
                color: inputText,
                borderColor: inputBorder,
              },
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., My Personal Best"
            placeholderTextColor={placeholderColor}
            maxLength={50}
          />
          <View style={styles.saveModalButtons}>
            <PressableFeedback
              style={[
                styles.saveModalButton,
                actionButtonStyle,
                buttonElevation(),
                { backgroundColor: secondaryButtonColor },
              ]}
              onPress={onClose}
            >
              <Text style={[styles.saveModalButtonText, { color: buttonTextColor }]}>
                Cancel
              </Text>
            </PressableFeedback>
            <PressableFeedback
              style={[
                styles.saveModalButton,
                actionButtonStyle,
                buttonElevation(),
                { backgroundColor: primaryButtonColor },
              ]}
              onPress={onSave}
            >
              <Text style={[styles.saveModalButtonText, { color: buttonTextColor }]}>
                Save
              </Text>
            </PressableFeedback>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  saveModalContent: {
    borderRadius: Radius.lg,
    padding: scaleSpacing(20),
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
    fontSize: scaleFont(15),
  },
});
