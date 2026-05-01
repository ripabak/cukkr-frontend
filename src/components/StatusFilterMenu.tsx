import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface StatusOption {
  label: string;
  value: string;
  color?: string;
}

interface Props {
  visible: boolean;
  options: StatusOption[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose?: () => void;
  style?: ViewStyle;
}

export const SCHEDULE_STATUS_OPTIONS: StatusOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Waiting', value: 'waiting', color: '#F0A11A' },
  { label: 'In Progress', value: 'in-progress', color: '#0D78FF' },
];

export const HISTORY_STATUS_OPTIONS: StatusOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed', color: '#4CC76B' },
  { label: 'Waiting', value: 'waiting', color: '#F0A11A' },
  { label: 'In Progress', value: 'in-progress', color: '#0D78FF' },
  { label: 'Canceled', value: 'canceled', color: '#FF4A4A' },
];

export function StatusFilterMenu({ visible, options, selected, onSelect, onClose, style }: Props) {
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
            <Text
              style={[
                styles.itemText,
                opt.color ? { color: opt.color } : undefined,
                selected === opt.value && styles.itemTextBold,
              ]}
            >
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 160,
    zIndex: 100,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD0',
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  itemTextBold: {
    fontWeight: '700',
  },
});
