import { Colors } from '@/src/theme/colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

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
  { label: 'Waiting', value: 'waiting', color: Colors.status.waiting },
  { label: 'In Progress', value: 'in_progress', color: Colors.status.inProgress },
];

export const HISTORY_STATUS_OPTIONS: StatusOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed', color: Colors.status.success },
  { label: 'Waiting', value: 'waiting', color: Colors.status.waiting },
  { label: 'In Progress', value: 'in_progress', color: Colors.status.inProgress },
  { label: 'Canceled', value: 'canceled', color: Colors.status.danger },
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
    backgroundColor: Colors.bg.default,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
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
    borderBottomColor: Colors.border.light,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  itemTextBold: {
    fontWeight: '700',
  },
});
