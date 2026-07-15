import { Colors } from "@/src/theme/colors";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface Props {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export function SuccessState({ title, subtitle, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <AppText style={styles.title}>{title}</AppText>
      {subtitle ? <AppText style={styles.subtitle}>{subtitle}</AppText> : null}
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
