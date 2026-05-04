import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title: string;
  onBack?: () => void;
  onSave?: () => void;
  style?: ViewStyle;
}

export function EditFieldHeader({ title, onBack, onSave, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backButton}>
        <Ionicons name="chevron-back" size={18} color="#1A1A1A" />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onSave} activeOpacity={0.7} style={styles.saveButton}>
        <Ionicons name="checkmark" size={18} color="#FFFFFF" />
      </TouchableOpacity>
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
  backButton: {
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
  saveButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
