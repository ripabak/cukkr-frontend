import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type BookingType = 'appointment' | 'walkin';

interface Props {
  value: BookingType;
  onChange: (type: BookingType) => void;
}

export function BookingTypeToggle({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onChange('appointment')}
        activeOpacity={0.8}
        style={[styles.iconBtn, value === 'appointment' && styles.iconBtnActive]}
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color={value === 'appointment' ? '#1A1A1A' : '#9D9DA5'}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onChange('walkin')}
        activeOpacity={0.8}
        style={[styles.iconBtn, value === 'walkin' && styles.iconBtnActive]}
      >
        <Ionicons
          name="person-outline"
          size={20}
          color={value === 'walkin' ? '#1A1A1A' : '#9D9DA5'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  iconBtnActive: {
    backgroundColor: '#B7DF2B',
  },
});
