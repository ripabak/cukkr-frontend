import { AppText } from "@/src/components/AppText";
import { Colors } from "@/src/theme/colors";
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
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        isLarge ? styles.largeContainer : styles.container,
        style,
      ]}
    >
      <View
        style={[
          isLarge ? styles.largeIconCircle : styles.iconCircle,
          iconBg ? { backgroundColor: iconBg, borderWidth: 0 } : undefined,
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
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    backgroundColor: Colors.bg.default,
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "600",
    color: Colors.text.primary,
    textAlign: "center",
  },

  largeContainer: {
    flex: 1,
    minWidth: "45%",
    height: 142,
    backgroundColor: Colors.bg.default,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  largeIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1.5,
    borderColor: Colors.border.light,
    backgroundColor: Colors.bg.default,
    alignItems: "center",
    justifyContent: "center",
  },
  largeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
    fontWeight: "700",
    color: "#fff",
  },
});
