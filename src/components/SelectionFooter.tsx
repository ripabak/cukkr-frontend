import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  count: number;
}

export function SelectionFooter({ count }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Customers ({count})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 18,
    paddingBottom: 32,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
