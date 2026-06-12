import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
  highlightDates?: Set<string>;
  waitingDates?: Set<string>;
}

export function DayChipRow({
  days,
  selectedKey,
  onSelect,
  onShowMore,
  highlightDates,
  waitingDates,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {days.map((day) => {
        const isSelected = day.dateKey === selectedKey;
        const hasRequest = !isSelected && highlightDates?.has(day.dateKey);
        const hasWaiting = !isSelected && waitingDates?.has(day.dateKey);
        return (
          <TouchableOpacity
            key={day.dateKey}
            onPress={() => onSelect(day.dateKey)}
            activeOpacity={0.8}
            style={[styles.chip, isSelected && styles.chipSelected]}
          >
            <Text
              style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}
            >
              {day.dayLabel}
            </Text>
            <Text
              style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}
            >
              {day.dayNumber}
            </Text>
            <View style={styles.dotsRow}>
              {hasRequest ? (
                <View style={styles.requestDot} />
              ) : (
                <View style={styles.dotPlaceholder} />
              )}
              {hasWaiting ? (
                <View style={styles.waitingDot} />
              ) : (
                <View style={styles.dotPlaceholder} />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
      {onShowMore ? (
        <TouchableOpacity
          onPress={onShowMore}
          activeOpacity={0.8}
          style={[styles.chip, styles.moreChip]}
        >
          <Ionicons
            name="chevron-forward"
            size={18}
            color={Colors.icon.muted}
          />
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    width: 58,
    height: 72,
    borderRadius: 16,
    backgroundColor: Colors.bg.surface,
    alignItems: "center",
    justifyContent: "center",
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
    fontWeight: "500",
    color: Colors.icon.muted,
  },
  dayLabelSelected: {
    color: Colors.text.primary,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  dayNumberSelected: {
    color: Colors.text.primary,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 3,
  },
  requestDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E63030",
  },
  waitingDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.brand.primary,
  },
  dotPlaceholder: {
    width: 5,
    height: 5,
  },
});
