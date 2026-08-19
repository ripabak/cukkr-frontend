import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

type BookingType = "appointment" | "walkin";

interface Props {
  value: BookingType;
  onChange: (type: BookingType) => void;
}

export function BookingTypeToggle({ value, onChange }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={[styles.container, Neu.inset(colors.bg.surface, 0.6)]}>
      <TouchableOpacity
        onPress={() => onChange("appointment")}
        activeOpacity={0.85}
        style={[
          styles.iconBtn,
          value === "appointment" && Neu.accent(0.8),
        ]}
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color={
            value === "appointment" ? colors.text.primary : colors.icon.muted
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onChange("walkin")}
        activeOpacity={0.85}
        style={[
          styles.iconBtn,
          value === "walkin" && Neu.accent(0.8),
        ]}
      >
        <Ionicons
          name="walk"
          size={20}
          color={value === "walkin" ? colors.text.primary : colors.icon.muted}
        />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
    borderRadius: 14,
    padding: 3,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  });
