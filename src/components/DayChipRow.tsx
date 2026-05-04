import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
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
      contentContainerStyle={styles.row}
    >
      {days.map((day) => {
        const isSelected = day.dateKey === selectedKey;
        return (
          <TouchableOpacity
            key={day.dateKey}
            onPress={() => onSelect(day.dateKey)}
            activeOpacity={0.8}
            style={[styles.chip, isSelected && styles.chipSelected]}
          >
            <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
              {day.dayLabel}
            </Text>
            <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
              {day.dayNumber}
            </Text>
          </TouchableOpacity>
        );
      })}
      {onShowMore ? (
        <TouchableOpacity
          onPress={onShowMore}
          activeOpacity={0.8}
          style={[styles.chip, styles.moreChip]}
        >
          <Ionicons name="chevron-forward" size={18} color="#1A1A1A" />
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    width: 58,
    height: 68,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: '#1A1A1A',
  },
  moreChip: {
    backgroundColor: '#FFFFFF',
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888888',
  },
  dayLabelSelected: {
    color: '#FFFFFF',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  dayNumberSelected: {
    color: '#FFFFFF',
  },
});
