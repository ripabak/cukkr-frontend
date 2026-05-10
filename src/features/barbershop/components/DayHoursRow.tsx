import { Colors } from '@/src/theme/colors';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { ToggleSwitch } from '@/src/components/ToggleSwitch';
import { TimePickerModal } from '@/src/components/TimePickerModal';

interface TimeValue {
  hour: number;
  minute: number;
  amPm: 'AM' | 'PM';
}

interface Props {
  day: string;
  enabled: boolean;
  onEnabledChange: (v: boolean) => void;
  openTime: TimeValue;
  closeTime: TimeValue;
  onOpenTimeChange: (t: TimeValue) => void;
  onCloseTimeChange: (t: TimeValue) => void;
  isLast?: boolean;
  style?: ViewStyle;
}

function formatTime(t: TimeValue): string {
  const h = t.hour < 10 ? `0${t.hour}` : String(t.hour);
  const m = t.minute < 10 ? `0${t.minute}` : String(t.minute);
  return `${h}:${m} ${t.amPm}`;
}

export function DayHoursRow({
  day,
  enabled,
  onEnabledChange,
  openTime,
  closeTime,
  onOpenTimeChange,
  onCloseTimeChange,
  isLast,
  style,
}: Props) {
  const [showOpenPicker, setShowOpenPicker] = useState(false);
  const [showClosePicker, setShowClosePicker] = useState(false);

  return (
    <View style={[styles.wrapper, !isLast && styles.borderBottom, style]}>
      <View style={styles.row}>
        <ToggleSwitch value={enabled} onValueChange={onEnabledChange} />
        <Text style={[styles.day, !enabled && styles.dayDisabled]}>{day}</Text>
        <View style={styles.times}>
          <TouchableOpacity
            onPress={() => setShowOpenPicker(true)}
            activeOpacity={0.7}
            style={[styles.timePill, !enabled && styles.timePillDisabled]}
            disabled={!enabled}
          >
            <Text style={[styles.timeText, !enabled && styles.timeTextDisabled]}>
              {formatTime(openTime)}
            </Text>
          </TouchableOpacity>
          <Text style={styles.dash}>–</Text>
          <TouchableOpacity
            onPress={() => setShowClosePicker(true)}
            activeOpacity={0.7}
            style={[styles.timePill, !enabled && styles.timePillDisabled]}
            disabled={!enabled}
          >
            <Text style={[styles.timeText, !enabled && styles.timeTextDisabled]}>
              {formatTime(closeTime)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showOpenPicker ? (
        <View style={styles.pickerWrapper}>
          <TimePickerModal
            visible
            initialHour={openTime.hour}
            initialMinute={openTime.minute}
            initialAmPm={openTime.amPm}
            onConfirm={(h, m, ap) => {
              onOpenTimeChange({ hour: h, minute: m, amPm: ap });
              setShowOpenPicker(false);
            }}
            onClose={() => setShowOpenPicker(false)}
          />
        </View>
      ) : null}

      {showClosePicker ? (
        <View style={styles.pickerWrapper}>
          <TimePickerModal
            visible
            initialHour={closeTime.hour}
            initialMinute={closeTime.minute}
            initialAmPm={closeTime.amPm}
            onConfirm={(h, m, ap) => {
              onCloseTimeChange({ hour: h, minute: m, amPm: ap });
              setShowClosePicker(false);
            }}
            onClose={() => setShowClosePicker(false)}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  day: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    width: 36,
  },
  dayDisabled: {
    color: '#B0ADA0',
  },
  times: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  timePill: {
    backgroundColor: Colors.bg.default,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E0DDD0',
  },
  timePillDisabled: {
    opacity: 0.4,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  timeTextDisabled: {
    color: '#B0ADA0',
  },
  dash: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  pickerWrapper: {
    marginTop: 8,
  },
});
