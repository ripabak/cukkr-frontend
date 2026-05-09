import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface StatusOption {
  label: string;
  value: string;
  color?: string;
}

interface Props {
  visible: boolean;
  options: StatusOption[];
  selected?: string;
  onSelect: (value: string) => void;
  onClose?: () => void;
  style?: ViewStyle;
}

export const SCHEDULE_STATUS_OPTIONS: StatusOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Waiting', value: 'waiting', color: '#F0A11A' },
  { label: 'In Progress', value: 'in-progress', color: '#0D78FF' },
];

export const HISTORY_STATUS_OPTIONS: StatusOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed', color: '#4CC76B' },
  { label: 'Waiting', value: 'waiting', color: '#F0A11A' },
  { label: 'In Progress', value: 'in-progress', color: '#0D78FF' },
  { label: 'Canceled', value: 'canceled', color: '#FF4A4A' },
];

export function StatusFilterMenu({ visible, options, selected, onSelect, onClose, style }: Props) {
  if (!visible) return null;

  return (
    <>
      <TouchableOpacity className="absolute inset-0" onPress={onClose} activeOpacity={1} />
      <View className="absolute top-14 right-xl bg-card rounded-md min-w-[160px] z-[100]" style={[{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 8 }, style]}>
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
            <Text
              className={`text-body font-medium${selected === opt.value ? ' font-bold' : ''}`}
              style={opt.color ? { color: opt.color } : { color: '#1A1A1A' }}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}


