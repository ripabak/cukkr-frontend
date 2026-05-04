import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface Props {
  selectionMode: boolean;
  onToggleSelect: () => void;
  onFilterPress?: () => void;
}

export function SelectionToolbar({ selectionMode, onToggleSelect, onFilterPress }: Props) {
  const router = useRouter();

  return (
    <View style={styles.row}>
      {selectionMode ? (
        <View style={styles.spacer} />
      ) : (
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      )}
      <View style={styles.right}>
        <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
          <Ionicons name="filter" size={18} color="#1A1A1A" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onToggleSelect}>
          <Text style={styles.selectText}>{selectionMode ? 'Cancel' : 'Select'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  spacer: {
    width: 36,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 18,
  },
});
