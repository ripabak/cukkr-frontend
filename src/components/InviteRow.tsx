import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  email: string;
  onRemove?: () => void;
  style?: ViewStyle;
  className?: string;
}

export function InviteRow({ email, onRemove, style, className }: Props) {
  return (
    <View
      className={`flex-row items-center bg-card rounded-full border border-border px-lg py-[14px]${className ? ` ${className}` : ''}`}
      style={style}
    >
      <View className="w-[6px] h-[6px] rounded-full bg-dark" />
      <Text className="flex-1 text-body text-dark ml-[10px]">{email}</Text>
      <TouchableOpacity
        onPress={onRemove}
        activeOpacity={0.7}
        className="w-7 h-7 rounded-full bg-danger items-center justify-center"
      >
        <Ionicons name="close" size={14} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
