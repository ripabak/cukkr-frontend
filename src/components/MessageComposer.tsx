import React from 'react';
import { View, TextInput, ViewStyle } from 'react-native';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export function MessageComposer({ value, onChangeText, placeholder = 'Messages to selected customers', style }: Props) {
  return (
    <View className="bg-card rounded-xl p-lg min-h-[120px]" style={style}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B0ADA0"
        multiline
        textAlignVertical="top"
        className="text-body text-dark leading-[22px] flex-1 min-h-[88px]"
      />
    </View>
  );
}


