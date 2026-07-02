import { Colors } from "@/src/theme/colors";
import React from "react";
import { TouchableOpacity, View, StyleSheet, ViewStyle } from "react-native";

interface Props {
  value: boolean;
  onValueChange: (v: boolean) => void;
  disabled?: boolean;
  style?: ViewStyle;
}

export function ToggleSwitch({ value, onValueChange, disabled, style }: Props) {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)}
      activeOpacity={0.8}
      disabled={disabled}
      style={[styles.track, value ? styles.trackOn : styles.trackOff, disabled && styles.trackDisabled, style]}
    >
      <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  trackOn: {
    backgroundColor: Colors.brand.primary,
  },
  trackOff: {
    backgroundColor: Colors.border.default,
  },
  trackDisabled: {
    opacity: 0.5,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.bg.default,
  },
  thumbOn: {
    alignSelf: "flex-end",
  },
  thumbOff: {
    alignSelf: "flex-start",
  },
});
