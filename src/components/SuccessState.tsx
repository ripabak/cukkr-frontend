import { Colors } from "@/src/theme/colors";
import React from "react";
import { View, Text, StyleSheet, ViewStyle } from "react-native";

interface Props {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export function SuccessState({ title, subtitle, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 12,
    textAlign: "center",
  },
});
