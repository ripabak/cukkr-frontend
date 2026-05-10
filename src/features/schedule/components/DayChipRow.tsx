import { Colors } from '@/src/theme/colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

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
          <Ionicons name="chevron-forward" size={18} color={Colors.icon.muted} />
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
    backgroundColor: Colors.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  chipSelected: {
    backgroundColor: Colors.brand.primary,
    borderColor: Colors.brand.primary,
  },
  moreChip: {
    backgroundColor: Colors.bg.surface,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.icon.muted,
  },
  dayLabelSelected: {
    color: Colors.text.primary,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  dayNumberSelected: {
    color: Colors.text.primary,
  },
});
