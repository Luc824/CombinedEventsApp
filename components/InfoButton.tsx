import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { TRACK_COLOR } from "../constants/ui";

type InfoButtonProps = {
  onPress: () => void;
  color?: string;
};

export default function InfoButton({ onPress, color = TRACK_COLOR }: InfoButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      accessibilityRole="button"
      accessibilityLabel="How combined events work"
    >
      <Ionicons name="information-circle-outline" size={24} color={color} />
    </TouchableOpacity>
  );
}
