import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { AppText } from "@/src/components/AppText";
import {
  ScrollView,
  StyleSheet,
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
            <AppText
              style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}
            >
              {day.dayLabel.toUpperCase()}
            </AppText>
            <AppText
              style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}
            >
              {day.dayNumber}
            </AppText>
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
    gap: 10,
    paddingVertical: 6,
  },
  chip: {
    width: 66,
    height: 84,
    borderRadius: 20,
    backgroundColor: Colors.bg.default,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderWidth: 1,
    borderColor: Colors.border.light,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: Colors.brand.primary,
    borderColor: Colors.brand.primary,
    boxShadow: "0px 4px 12px rgba(255, 200, 30, 0.35)",
    elevation: 3,
  },
  moreChip: {
    backgroundColor: Colors.bg.default,
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.muted,
    letterSpacing: 0.5,
  },
  dayLabelSelected: {
    color: Colors.text.primary,
  },
  dayNumber: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  dayNumberSelected: {
    color: Colors.text.primary,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 3,
    marginTop: 4,
  },
  requestDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.status.danger,
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
