import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type BookingType = 'appointment' | 'walkin';

interface Props {
  value: BookingType;
  onChange: (type: BookingType) => void;
}

export function BookingTypeToggle({ value, onChange }: Props) {
  return (
    <View className="flex-row gap-[6px]">
      <TouchableOpacity
        onPress={() => onChange('appointment')}
        activeOpacity={0.8}
        className={`w-9 h-9 rounded-[10px] items-center justify-center${value === 'appointment' ? ' bg-[#B7DF2B]' : ''}`}
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
        className={`w-9 h-9 rounded-[10px] items-center justify-center${value === 'walkin' ? ' bg-[#B7DF2B]' : ''}`}
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


