import { Colors } from "@/src/theme/colors";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";
import { View } from "react-native";

interface Props {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  iconBg?: string;
}

export function ShortcutTile({ label, icon, onPress, style, iconBg }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      <View
        style={[
          styles.iconCircle,
          iconBg ? { backgroundColor: iconBg, borderWidth: 0 } : undefined,
        ]}
      >
        {icon}
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    backgroundColor: Colors.bg.default,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});
