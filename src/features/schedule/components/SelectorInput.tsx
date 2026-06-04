import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";

interface Props {
  placeholder: string;
  value?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  style?: ViewStyle;
}

export function SelectorInput({
  placeholder,
  value,
  iconName,
  onPress,
  style,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.container, style]}
    >
      {iconName ? (
        <Ionicons
          name={iconName}
          size={18}
          color={Colors.icon.muted}
          style={styles.icon}
        />
      ) : null}
      <Text
        style={[
          styles.text,
          value ? styles.textFilled : styles.textPlaceholder,
        ]}
        numberOfLines={1}
      >
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-forward" size={16} color={Colors.icon.muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg.default,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: Colors.border.default,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  icon: {},
  text: {
    flex: 1,
    fontSize: 14,
  },
  textPlaceholder: {
    color: Colors.text.muted,
  },
  textFilled: {
    color: Colors.text.primary,
  },
});
