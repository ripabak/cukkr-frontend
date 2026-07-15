import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";

type BookingType = "appointment" | "walkin";

interface Props {
  value: BookingType;
  onChange: (type: BookingType) => void;
}

export function BookingTypeToggle({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onChange("appointment")}
        activeOpacity={0.8}
        style={[
          styles.iconBtn,
          value === "appointment" && styles.iconBtnActive,
        ]}
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color={
            value === "appointment" ? Colors.text.primary : Colors.icon.muted
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onChange("walkin")}
        activeOpacity={0.8}
        style={[styles.iconBtn, value === "walkin" && styles.iconBtnActive]}
      >
        <Ionicons
          name="walk"
          size={20}
          color={value === "walkin" ? Colors.text.primary : Colors.icon.muted}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 6,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  iconBtnActive: {
    backgroundColor: Colors.brand.primary,
  },
});
