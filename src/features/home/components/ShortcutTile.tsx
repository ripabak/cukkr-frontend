import { Colors } from "@/src/theme/colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface Props {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export function ShortcutTile({ label, icon, onPress, style }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={[styles.container, style]}>
      {icon}
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 8,
    backgroundColor: Colors.brand.primaryDark,
    borderRadius: 14,
    gap: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
});
