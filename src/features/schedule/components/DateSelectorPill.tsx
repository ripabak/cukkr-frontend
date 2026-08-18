import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface Props {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function DateSelectorPill({ label, onPress, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.pill, Neu.soft(Colors.bg.surface), style]}
    >
      <Ionicons
        name="calendar-outline"
        size={16}
        color={Colors.text.primary}
        style={styles.icon}
      />
      <AppText style={styles.label}>{label}</AppText>
      <Ionicons
        name="chevron-down"
        size={14}
        color={Colors.text.primary}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignSelf: "flex-start",
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  chevron: {
    marginLeft: 8,
  },
});
