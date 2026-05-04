import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  lines: string[];
  style?: ViewStyle;
  errorLine?: string;
}

export function HelperCopy({ lines, style, errorLine }: Props) {
  return (
    <View style={style}>
      {lines.map((line, index) => (
        <Text key={index} style={styles.line}>
          {line}
        </Text>
      ))}
      {errorLine ? <Text style={styles.errorLine}>{errorLine}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  line: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 20,
  },
  errorLine: {
    fontSize: 13,
    color: '#E53E3E',
    lineHeight: 20,
  },
});
