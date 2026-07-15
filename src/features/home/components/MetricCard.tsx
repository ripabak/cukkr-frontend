import { Colors } from "@/src/theme/colors";
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
  return (
    <View
      style={[
        styles.card,
        accentColor ? { borderWidth: 1, borderColor: accentColor } : undefined,
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg.surface,
    borderRadius: 12,
    padding: 12,
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: Colors.text.secondary,
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
    fontWeight: "700",
    color: Colors.text.primary,
  },
});
