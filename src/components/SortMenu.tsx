import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface SortOption {
  label: string;
  value: string;
}

interface Props {
  visible: boolean;
  options: SortOption[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose?: () => void;
  style?: ViewStyle;
}

const DEFAULT_OPTIONS: SortOption[] = [
  { label: 'Sort by Name', value: 'name' },
  { label: 'Sort by Lowest', value: 'lowest' },
  { label: 'Sort by Highest', value: 'highest' },
  { label: 'Sort by Recently Added', value: 'recent' },
  { label: 'Sort by Oldest First', value: 'oldest' },
];

export function SortMenu({ visible, options = DEFAULT_OPTIONS, selected, onSelect, onClose, style }: Props) {
  if (!visible) return null;

  return (
    <>
      <TouchableOpacity className="absolute inset-0" onPress={onClose} activeOpacity={1} />
      <View className="absolute top-14 right-xl bg-card rounded-md min-w-[200px] z-[100]" style={[{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 8 }, style]}>
        {options.map((opt, index) => (
          <TouchableOpacity
            key={opt.value}
            onPress={() => {
              onSelect(opt.value);
              onClose?.();
            }}
            activeOpacity={0.7}
            className={`px-lg py-[14px]${index < options.length - 1 ? ' border-b border-border' : ''}`}
          >
            <Text className={`text-body font-medium text-dark${selected === opt.value ? ' font-bold' : ''}`}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}


