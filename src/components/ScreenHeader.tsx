import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenHeader({ title, onBack, rightAction, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.iconButton} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={18} color="#1A1A1A" />
        </TouchableOpacity>
      ) : (
        <View style={styles.iconButton} />
      )}
      {title ? <Text style={styles.title}>{title}</Text> : <View style={styles.titleSpacer} />}
      {rightAction ? (
        <View style={styles.rightSlot}>{rightAction}</View>
      ) : (
        <View style={styles.iconButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0DDD0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  titleSpacer: {
    flex: 1,
  },
  rightSlot: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
