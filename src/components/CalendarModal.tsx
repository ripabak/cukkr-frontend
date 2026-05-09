import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
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
      <TouchableOpacity className="flex-1 bg-black/20 justify-center items-center px-xxl" activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} className="bg-card rounded-[20px] p-xl w-full">
          {/* Month navigation */}
          <View className="flex-row items-center justify-between mb-lg">
            <TouchableOpacity onPress={prevMonth} activeOpacity={0.7} className="w-8 h-8 items-center justify-center">
              <Ionicons name="chevron-back" size={18} color="#1A1A1A" />
            </TouchableOpacity>
            <Text className="text-[16px] font-semibold text-dark">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} activeOpacity={0.7} className="w-8 h-8 items-center justify-center">
              <Ionicons name="chevron-forward" size={18} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {/* Day labels */}
          <View className="flex-row mb-sm">
            {DAY_LABELS.map((d) => (
              <Text key={d} className="flex-1 text-center text-[11px] font-semibold text-[#AAAAAA]">{d}</Text>
            ))}
          </View>

          {/* Calendar grid */}
          {rows.map((row, ri) => (
            <View key={ri} className="flex-row mb-[4px]">
              {row.map((day, di) => (
                <View key={di} className="flex-1 items-center justify-center h-9">
                  {day !== null ? (
                    <TouchableOpacity
                      onPress={() => onSelect(new Date(viewYear, viewMonth, day))}
                      activeOpacity={0.8}
                      className={`w-[34px] h-[34px] rounded-full items-center justify-center${isSelected(day) ? ' bg-[#E63030]' : ''}`}
                    >
                      <Text className={`text-body${isSelected(day) ? ' text-white font-bold' : ' text-dark'}`}>
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


