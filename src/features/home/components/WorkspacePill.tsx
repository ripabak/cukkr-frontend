import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

interface Props {
  name: string;
  onPress?: () => void;
  style?: ViewStyle;
}

export function WorkspacePill({ name, onPress, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <Ionicons
        name="chevron-down"
        size={16}
        color={Colors.icon.muted}
        style={styles.icon}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border.default,
    backgroundColor: Colors.bg.surface,
    maxWidth: 220,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    flex: 1,
  },
  icon: {
    marginLeft: 4,
    flexShrink: 0,
  },
});
