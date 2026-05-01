import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  selectedDate?: Date;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function CalendarModal({ visible, selectedDate, onSelect, onClose }: Props) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(selectedDate?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selectedDate?.getMonth() ?? today.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === day
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={styles.card}>
          {/* Month navigation */}
          <View style={styles.monthRow}>
            <TouchableOpacity onPress={prevMonth} activeOpacity={0.7} style={styles.navBtn}>
              <Ionicons name="chevron-back" size={18} color="#1A1A1A" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} activeOpacity={0.7} style={styles.navBtn}>
              <Ionicons name="chevron-forward" size={18} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {/* Day labels */}
          <View style={styles.dayLabelRow}>
            {DAY_LABELS.map((d) => (
              <Text key={d} style={styles.dayLabel}>{d}</Text>
            ))}
          </View>

          {/* Calendar grid */}
          {rows.map((row, ri) => (
            <View key={ri} style={styles.week}>
              {row.map((day, di) => (
                <View key={di} style={styles.dayCell}>
                  {day !== null ? (
                    <TouchableOpacity
                      onPress={() => onSelect(new Date(viewYear, viewMonth, day))}
                      activeOpacity={0.8}
                      style={[styles.dayBtn, isSelected(day) && styles.dayBtnSelected]}
                    >
                      <Text style={[styles.dayText, isSelected(day) && styles.dayTextSelected]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              ))}
            </View>
          ))}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  navBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  dayLabelRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    color: '#AAAAAA',
  },
  week: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
  },
  dayBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBtnSelected: {
    backgroundColor: '#E63030',
  },
  dayText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
