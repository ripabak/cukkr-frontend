import { Colors } from '@/src/theme/colors';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  name: string;
  totalBook: number;
  bookValue: string;
  selected?: boolean;
  selectionMode?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export function CustomerCard({ name, totalBook, bookValue, selected, selectionMode, onPress, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.card, selected && styles.cardSelected, style]}
    >
      <View style={styles.avatar}>
        <Ionicons name="person" size={22} color={Colors.text.primary} />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>
          Total Book <Text style={styles.metaBold}>{totalBook}</Text>
          {'  ·  '}Book Value <Text style={styles.metaBold}>{bookValue}</Text>
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.icon.muted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.brand.primarySurface,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: Colors.bg.default,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.brand.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 3,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  meta: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  metaBold: {
    fontWeight: '600',
    color: Colors.text.primary,
  },
});
