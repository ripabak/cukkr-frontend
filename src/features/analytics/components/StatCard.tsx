import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { AppText } from "@/src/components/AppText";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface StatCardData {
  current: number;
  previous: number;
  change: number | null;
  direction: "up" | "down" | "neutral";
}

interface Props {
  label: string;
  value: string;
  icon: React.ReactNode;
  stat: StatCardData;
  onPress?: () => void;
  style?: ViewStyle;
}

export function TrendBadge({
  direction,
  change,
}: {
  direction: "up" | "down" | "neutral";
  change: number | null;
}) {
  if (direction === "neutral" || change === null) return null;
  const isUp = direction === "up";
  const color = isUp ? Colors.brand.primaryDark : Colors.status.danger;
  const icon = isUp ? "trending-up" : "trending-down";
  const label = `${Math.abs(change).toFixed(change % 1 === 0 ? 0 : 1)}%`;

  return (
    <View
      style={[
        trendStyles.badge,
        {
          backgroundColor: isUp
            ? Colors.brand.primarySurface
            : Colors.status.dangerSurface,
        },
      ]}
    >
      <Ionicons name={icon} size={11} color={color} />
      <AppText style={[trendStyles.text, { color }]}>{label}</AppText>
    </View>
  );
}

const trendStyles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
  },
  text: {
    fontSize: 11,
    fontWeight: "600",
  },
});

export function StatCard({ label, value, icon, stat, onPress, style }: Props) {
  const Container = onPress ? TouchableOpacity : View;
  return (
    <Container
      style={[styles.card, style]}
      {...(onPress ? { onPress, activeOpacity: 0.8 } : {})}
    >
      <View style={styles.topRow}>
        <View style={styles.iconWrap}>{icon}</View>
        <View style={styles.topRight}>
          <TrendBadge direction={stat.direction} change={stat.change} />
          {onPress ? (
            <Ionicons name="chevron-forward" size={14} color={Colors.icon.muted} />
          ) : null}
        </View>
      </View>
      <AppText style={styles.value}>{value}</AppText>
      <AppText style={styles.label}>{label}</AppText>
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.bg.default,
    borderRadius: 20,
    padding: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border.light,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    elevation: 2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.bg.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text.primary,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 13,
    color: Colors.text.secondary,
    fontWeight: "500",
  },
});
