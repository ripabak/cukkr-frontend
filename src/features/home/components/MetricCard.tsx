import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface Props {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accentColor?: string;
  style?: ViewStyle;
}

export function MetricCard({ label, value, icon, accentColor, style }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View
      style={[
        styles.card,
        Neu.raised(colors.bg.surface),
        style,
      ]}
    >
      <AppText
        style={[styles.label, accentColor ? { color: accentColor } : undefined]}
      >
        {label}
      </AppText>
      <View style={styles.valueRow}>
        {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
        <AppText
          style={[
            styles.value,
            accentColor ? { color: accentColor } : undefined,
          ]}
        >
          {value}
        </AppText>
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 12,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: c.text.secondary,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 4,
  },
  iconWrap: {
    marginRight: 2,
  },
  value: {
    fontSize: 22,
    fontWeight: "600",
    color: c.text.primary,
  },
  });
