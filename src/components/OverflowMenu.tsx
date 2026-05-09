import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface MenuItem {
  label: string;
  onPress?: () => void;
  danger?: boolean;
}

interface Props {
  visible: boolean;
  items: MenuItem[];
  onClose?: () => void;
  style?: ViewStyle;
}

export function OverflowMenu({ visible, items, onClose, style }: Props) {
  if (!visible) return null;

  return (
    <>
      <TouchableOpacity className="absolute inset-0" onPress={onClose} activeOpacity={1} />
      <View className="absolute top-14 right-xl bg-card rounded-md min-w-[180px] z-[100]" style={[{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 8 }, style]}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              item.onPress?.();
              onClose?.();
            }}
            activeOpacity={0.7}
            className={`px-lg py-[14px]${index < items.length - 1 ? ' border-b border-border' : ''}`}
          >
            <Text className={`text-body font-medium${item.danger ? ' text-[#E53E3E]' : ' text-dark'}`}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}


