import { Colors } from "@/src/theme/colors";
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  label: string;
  onPress?: () => void;
  isLast?: boolean;
  style?: ViewStyle;
}

export function OperationRow({ label, onPress, isLast, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, !isLast && styles.borderBottom, style]}
    >
      <AppText style={styles.label}>{label}</AppText>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={Colors.text.secondary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  label: {
    fontWeight: "700",
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
});
