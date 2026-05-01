import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function ProfileSummaryCard({ children, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#D4E88F',
    borderRadius: 16,
    overflow: 'hidden',
  },
});
