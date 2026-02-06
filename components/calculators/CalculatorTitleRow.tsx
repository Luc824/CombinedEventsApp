import React from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CalculatorTitleRowProps = {
  title: string;
  onBack: () => void;
  showBack?: boolean;
  textColor: string;
  buttonBackground: string;
  buttonBorder: string;
};

export default function CalculatorTitleRow({
  title,
  onBack,
  showBack = Platform.OS !== "web",
  textColor,
  buttonBackground,
  buttonBorder,
}: CalculatorTitleRowProps) {
  return (
    <View style={styles.titleRow}>
      {showBack && (
        <TouchableOpacity
          style={[
            styles.backButton,
            { backgroundColor: buttonBackground, borderColor: buttonBorder },
          ]}
          onPress={onBack}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="chevron-back" size={22} color={textColor} />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "android" ? 26 : 14,
    marginBottom: 12,
    position: "relative",
    paddingLeft: 50,
    paddingRight: 50,
  },
  backButton: {
    width: 40,
    height: 40,
    position: "absolute",
    left: 0,
    zIndex: 1,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
  },
});
