import { Colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface SortOption {
  label: string;
  value: string;
}

interface Props {
  visible: boolean;
  options: SortOption[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose?: () => void;
  style?: ViewStyle;
}

const DEFAULT_OPTIONS: SortOption[] = [
  { label: 'Sort by Name', value: 'name' },
  { label: 'Sort by Lowest', value: 'lowest' },
  { label: 'Sort by Highest', value: 'highest' },
  { label: 'Sort by Recently Added', value: 'recent' },
  { label: 'Sort by Oldest First', value: 'oldest' },
];

export function SortMenu({ visible, options = DEFAULT_OPTIONS, selected, onSelect, onClose, style }: Props) {
  if (!visible) return null;

  return (
    <>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <View style={[styles.menu, style]}>
        {options.map((opt, index) => (
          <TouchableOpacity
            key={opt.value}
            onPress={() => {
              onSelect(opt.value);
              onClose?.();
            }}
            activeOpacity={0.7}
            style={[styles.item, index < options.length - 1 && styles.itemBorder]}
          >
            <Text style={[styles.itemText, selected === opt.value && styles.itemTextSelected]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  menu: {
    position: 'absolute',
    top: 56,
    right: 20,
    backgroundColor: Colors.bg.default,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 8,
    minWidth: 200,
    zIndex: 100,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  itemTextSelected: {
    fontWeight: '700',
    color: Colors.brand.primaryDark,
  },
});
