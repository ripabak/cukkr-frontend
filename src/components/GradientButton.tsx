import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  onPress?: () => void;
  icon?: string;
  style?: ViewStyle;
  className?: string;
}

export function GradientButton({ label, onPress, icon, style, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className={`flex-row items-center justify-center bg-[#2D3A20] rounded-full h-14 w-full gap-sm${className ? ` ${className}` : ''}`}
      style={style}
    >
      <Text className="text-base font-semibold text-white">{label}</Text>
      {icon === 'login' ? (
        <Ionicons name="log-in-outline" size={20} color="#FFFFFF" />
      ) : null}
    </TouchableOpacity>
  );
}
