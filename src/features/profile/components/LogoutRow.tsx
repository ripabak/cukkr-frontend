import { Colors } from "@/src/theme/colors";
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  onPress?: () => void;
  style?: ViewStyle;
}

export function LogoutRow({ onPress, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      <Text style={styles.label}>Logout</Text>
      <Ionicons name="exit-outline" size={20} color={Colors.text.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg.default,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  label: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});
