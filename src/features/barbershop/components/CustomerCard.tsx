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
        <Ionicons name="person" size={22} color="#1A1A1A" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.meta}>
          Total Book <Text style={styles.metaBold}>{totalBook}</Text>
          {'  ·  '}Book Value <Text style={styles.metaBold}>{bookValue}</Text>
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#555555" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#CFE57C',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#B8CC6A',
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
    color: '#1A1A1A',
  },
  meta: {
    fontSize: 12,
    color: '#555555',
  },
  metaBold: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
