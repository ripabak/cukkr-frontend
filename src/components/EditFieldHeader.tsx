import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title: string;
  onBack?: () => void;
  onSave?: () => void;
  style?: ViewStyle;
}

export function EditFieldHeader({ title, onBack, onSave, style }: Props) {
  return (
    <View className="flex-row items-center px-xl py-md" style={style}>
      <TouchableOpacity onPress={onBack} activeOpacity={0.7} className="w-9 h-9 rounded-full border border-border items-center justify-center">
        <Ionicons name="chevron-back" size={18} color="#1A1A1A" />
      </TouchableOpacity>
      <Text className="flex-1 text-center text-[17px] font-bold text-dark">{title}</Text>
      <TouchableOpacity onPress={onSave} activeOpacity={0.7} className="w-9 h-9 rounded-full bg-dark items-center justify-center">
        <Ionicons name="checkmark" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}


