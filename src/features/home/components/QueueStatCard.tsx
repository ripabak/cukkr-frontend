import { AppText } from "@/src/components/AppText";
import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface QueueStatCardProps {
  label: string;
  value: number;
  icon: React.ComponentProps<typeof Ionicons>["name"];
  onPress?: () => void;
  style?: ViewStyle;
}

export function QueueStatCard({
  label,
  value,
  icon,
  onPress,
  style,
}: QueueStatCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, Neu.raised(Colors.bg.surface), style]}
      disabled={!onPress}
    >
      <View style={[styles.iconCircle, Neu.inset(Colors.bg.surface, 0.6)]}>
        <Ionicons name={icon} size={24} color={Colors.brand.primaryDark} />
      </View>
      <AppText style={styles.value}>{value}</AppText>
      <AppText style={styles.label}>{label}</AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "45%",
    aspectRatio: 1,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  value: {
    fontSize: 34,
    fontWeight: "800",
    color: Colors.text.primary,
    letterSpacing: -0.8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
});
