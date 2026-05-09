import React from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface DayChip {
  dayLabel: string;
  dayNumber: number;
  dateKey: string;
}

interface Props {
  days: DayChip[];
  selectedKey: string;
  onSelect: (key: string) => void;
  onShowMore?: () => void;
}

export function DayChipRow({ days, selectedKey, onSelect, onShowMore }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ flexDirection: 'row', gap: 8, paddingVertical: 4 }}
    >
      {days.map((day) => {
        const isSelected = day.dateKey === selectedKey;
        return (
          <TouchableOpacity
            key={day.dateKey}
            onPress={() => onSelect(day.dateKey)}
            activeOpacity={0.8}
            className={`w-[58px] h-[68px] rounded-[16px] items-center justify-center gap-[2px] shadow-sm${isSelected ? ' bg-dark' : ' bg-card'}`}
          >
            <Text className={`text-[12px] font-medium${isSelected ? ' text-white' : ' text-[#888888]'}`}>
              {day.dayLabel}
            </Text>
            <Text className={`text-[18px] font-bold${isSelected ? ' text-white' : ' text-dark'}`}>
              {day.dayNumber}
            </Text>
          </TouchableOpacity>
        );
      })}
      {onShowMore ? (
        <TouchableOpacity
          onPress={onShowMore}
          activeOpacity={0.8}
          className="w-[58px] h-[68px] rounded-[16px] items-center justify-center gap-[2px] shadow-sm bg-card"
        >
          <Ionicons name="chevron-forward" size={18} color="#1A1A1A" />
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}


