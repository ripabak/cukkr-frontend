import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface Props {
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  isLast?: boolean;
  style?: ViewStyle;
}

export function InfoRow({ label, value, onPress, showChevron, isLast, style }: Props) {
  const content = (
    <View style={[styles.container, !isLast && styles.borderBottom, style]}>
      <Text style={styles.label}>{label}</Text>
      {value ? <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">{value}</Text> : null}
      {showChevron ? (
        <Ionicons name="chevron-forward" size={16} color="#666666" />
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
    borderBottomColor: '#E0DDD0',
  },
  label: {
    fontWeight: '700',
    fontSize: 14,
    color: '#1A1A1A',
  },
  value: {
    fontSize: 14,
    color: '#666666',
    flex: 1,
    textAlign: 'right',
  },
});
