import { Colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface Props {
  label: string;
  value?: string;
  valueIconName?: string;
  placeholder?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isLast?: boolean;
  style?: ViewStyle;
}

export function InfoRow({ label, value, valueIconName, placeholder, onPress, showChevron, isLast, style }: Props) {
  const displayValue = value || null;
  const displayPlaceholder = !value && placeholder ? placeholder : null;

  const content = (
    <View style={[styles.container, !isLast && styles.borderBottom, style]}>
      <Text style={styles.label}>{label}</Text>
      {displayValue ? (
        <View style={styles.valueRow}>
          {valueIconName ? <Ionicons name={valueIconName as any} size={13} color={Colors.text.secondary} /> : null}
          <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">{displayValue}</Text>
        </View>
      ) : displayPlaceholder ? (
        <Text style={styles.placeholder} numberOfLines={1}>{displayPlaceholder}</Text>
      ) : null}
      {showChevron ? (
        <Ionicons name="chevron-forward" size={16} color={Colors.icon.muted} />
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
    color: Colors.text.primary,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 'auto',
    maxWidth: '50%',
  },
  value: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'right',
    flexShrink: 1,
  },
  placeholder: {
    fontSize: 14,
    color: Colors.text.muted,
    maxWidth: '50%',
    marginLeft: 'auto',
    textAlign: 'right',
  },
});
