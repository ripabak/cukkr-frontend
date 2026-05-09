import React from 'react';
import { TouchableOpacity, Text, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  label: string;
  onPress?: () => void;
  isLast?: boolean;
  style?: ViewStyle;
  className?: string;
}

export function OperationRow({ label, onPress, isLast, style, className }: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center px-lg py-[14px]${!isLast ? ' border-b border-border' : ''} ${className ?? ''}`}
      style={style}
    >
      <Text className="font-bold text-body text-dark flex-1">{label}</Text>
      <Ionicons name="chevron-forward" size={16} color="#666666" />
    </TouchableOpacity>
  );
}
