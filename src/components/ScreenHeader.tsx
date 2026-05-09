import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  title?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  style?: ViewStyle;
}

export function ScreenHeader({ title, onBack, rightAction, style }: Props) {
  return (
    <View className="flex-row items-center px-xl py-md" style={style}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} className="w-9 h-9 rounded-full border border-border items-center justify-center" activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={18} color="#1A1A1A" />
        </TouchableOpacity>
      ) : (
        <View className="w-9 h-9 rounded-full border border-border items-center justify-center" />
      )}
      {title ? <Text className="flex-1 text-center text-[17px] font-bold text-dark">{title}</Text> : <View className="flex-1" />}
      {rightAction ? (
        <View className="w-9 h-9 items-center justify-center">{rightAction}</View>
      ) : (
        <View className="w-9 h-9 rounded-full border border-border items-center justify-center" />
      )}
    </View>
  );
}


