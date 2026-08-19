import { useThemedStyles } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface Props {
  lines: string[];
  style?: ViewStyle;
  errorLine?: string;
}

export function HelperCopy({ lines, style, errorLine }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={style}>
      {lines.map((line, index) => (
        <AppText key={index} style={styles.line}>
          {line}
        </AppText>
      ))}
      {errorLine ? <AppText style={styles.errorLine}>{errorLine}</AppText> : null}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    line: {
      fontSize: 13,
      color: c.text.secondary,
      lineHeight: 20,
    },
    errorLine: {
      fontSize: 13,
      color: c.status.danger,
      lineHeight: 20,
    },
  });
