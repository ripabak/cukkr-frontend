import { AppText } from "@/src/components/AppText";
import { Colors } from "@/src/theme/colors";
import { haptics } from "@/src/utils/haptics";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  View,
} from "react-native";

interface Props {
  label: string;
  icon: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  iconBg?: string;
  dotColor?: string;
  badgeCount?: number;
  variant?: "small" | "large";
}

export function ShortcutTile({
  label,
  icon,
  onPress,
  style,
  iconBg,
  dotColor,
  badgeCount,
  variant = "small",
}: Props) {
  const isLarge = variant === "large";

  return (
    <TouchableOpacity
      onPress={() => {
        haptics.light();
        onPress?.();
      }}
      activeOpacity={0.8}
      style={[
        isLarge ? styles.largeContainer : styles.container,
        style,
      ]}
    >
      <View
        style={[
          isLarge ? styles.largeIconCircle : styles.iconCircle,
          iconBg ? { backgroundColor: iconBg } : undefined,
        ]}
      >
        {dotColor ? (
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
        ) : null}
        {badgeCount && badgeCount > 0 ? (
          <View style={styles.badge}>
            <AppText style={styles.badgeText}>
              {badgeCount > 99 ? "99+" : badgeCount}
            </AppText>
          </View>
        ) : null}
        {icon}
      </View>
      <AppText style={isLarge ? styles.largeLabel : styles.label}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
    minWidth: 68,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bg.surface,
    borderWidth: 1,
    borderColor: Colors.border.light,
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
    fontWeight: "400",
    color: Colors.text.primary,
    textAlign: "center",
  },

  largeContainer: {
    minWidth: "45%",
    height: 142,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  largeIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bg.surface,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  largeLabel: {
    fontSize: 14,
    fontWeight: "400",
    color: Colors.text.primary,
    letterSpacing: 0.2,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.status.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
});
