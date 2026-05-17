import { Colors } from '@/src/theme/colors';
import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  value: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  style?: ViewStyle;
}

export function StatCard({ label, value, iconName, iconColor = Colors.brand.primary, style }: Props) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        {iconName && (
          <Ionicons name={iconName} size={20} color={iconColor} style={styles.icon} />
        )}
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg.default,
    borderRadius: 16,
    padding: 16,
    flex: 1,
    gap: 6,
  },
  label: {
    fontSize: 12,
    color: Colors.icon.muted,
    fontWeight: '500',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {},
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text.primary,
  },
});
