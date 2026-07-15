import { Colors } from "@/src/theme/colors";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface Props {
  lines: string[];
  style?: ViewStyle;
  errorLine?: string;
}

export function HelperCopy({ lines, style, errorLine }: Props) {
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

const styles = StyleSheet.create({
  line: {
    fontSize: 13,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  errorLine: {
    fontSize: 13,
    color: Colors.status.danger,
    lineHeight: 20,
  },
});
