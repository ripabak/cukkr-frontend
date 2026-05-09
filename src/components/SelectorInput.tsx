import React from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  placeholder: string;
  value?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  style?: ViewStyle;
}

export function SelectorInput({ placeholder, value, iconName, onPress, style }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-card rounded-full px-lg py-[14px] border border-border flex-row items-center gap-[10px]"
      style={style}
    >
      {iconName ? (
        <Ionicons name={iconName} size={18} color="#B0ADA0" />
      ) : null}
      <Text className={`flex-1 text-body${value ? ' text-dark' : ' text-light-gray'}`} numberOfLines={1}>
        {value || placeholder}
      </Text>
      <Ionicons name="chevron-forward" size={16} color="#B0ADA0" />
    </TouchableOpacity>
  );
}


