import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface MenuItem {
  label: string;
  onPress?: () => void;
  danger?: boolean;
}

interface Props {
  visible: boolean;
  items: MenuItem[];
  onClose?: () => void;
  style?: ViewStyle;
}

export function OverflowMenu({ visible, items, onClose, style }: Props) {
  if (!visible) return null;

  return (
    <>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      <View style={[styles.menu, style]}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              item.onPress?.();
              onClose?.();
            }}
            activeOpacity={0.7}
            style={[styles.item, index < items.length - 1 && styles.itemBorder]}
          >
            <Text style={[styles.itemText, item.danger && styles.itemTextDanger]}>
              {item.label}
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
    minWidth: 180,
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
  itemTextDanger: {
    color: '#E53E3E',
  },
});
