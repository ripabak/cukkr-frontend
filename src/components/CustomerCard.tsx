import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  name: string;
  totalBook: number;
  bookValue: string;
  selected?: boolean;
  selectionMode?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  className?: string;
}

export function CustomerCard({ name, totalBook, bookValue, selected, selectionMode, onPress, style, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`flex-row items-center bg-[#CFE57C] rounded-xl py-[14px] px-lg gap-md${selected ? ' border-2 border-white' : ''} ${className ?? ''}`}
      style={style}
    >
      <View className="w-10 h-10 rounded-full bg-[#B8CC6A] items-center justify-center">
        <Ionicons name="person" size={22} color="#1A1A1A" />
      </View>
      <View className="flex-1 gap-[3px]">
        <Text className="text-[15px] font-bold text-dark">{name}</Text>
        <Text className="text-[12px] text-[#555555]">
          Total Book <Text className="font-semibold text-dark">{totalBook}</Text>
          {'  ·  '}Book Value <Text className="font-semibold text-dark">{bookValue}</Text>
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#555555" />
    </TouchableOpacity>
  );
}
