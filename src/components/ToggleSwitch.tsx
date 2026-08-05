import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
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
      activeOpacity={0.85}
      disabled={disabled}
      style={[
        styles.track,
        value ? styles.trackOn : styles.trackOff,
        disabled && styles.trackDisabled,
        style,
      ]}
    >
      <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff, Neu.soft(Colors.bg.surface)]} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 26,
    borderRadius: 13,
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
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  thumbOn: {
    alignSelf: "flex-end",
  },
  thumbOff: {
    alignSelf: "flex-start",
  },
});
