import { Colors } from "@/src/theme/colors";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle, View } from "react-native";
import { AppText } from "@/src/components/AppText";

interface Props {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  iconBg?: string;
  dotColor?: string;
}

export function ShortcutTile({ label, icon, onPress, style, iconBg, dotColor }: Props) {
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
        {dotColor ? <View style={[styles.dot, { backgroundColor: dotColor }]} /> : null}
        {icon}
      </View>
      <AppText style={styles.label}>{label}</AppText>
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
  dot: {
    position: "absolute",
    bottom: 16,
    right: 14,
    width: 12,
    height: 12,
    borderRadius: 12,
    opacity: 0.8,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});
