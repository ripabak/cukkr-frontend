import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ViewStyle } from 'react-native';
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
    <View className={`px-lg py-md${!isLast ? ' border-b border-border' : ''}`} style={style}>
      <View className="flex-row items-center gap-md">
        <ToggleSwitch value={enabled} onValueChange={onEnabledChange} />
        <Text className={`text-body font-semibold w-9${!enabled ? ' text-light-gray' : ' text-dark'}`}>{day}</Text>
        <View className="flex-1 flex-row items-center justify-end gap-[6px]">
          <TouchableOpacity
            onPress={() => setShowOpenPicker(true)}
            activeOpacity={0.7}
            className={`bg-card rounded-full px-[10px] py-[6px] border border-border${!enabled ? ' opacity-40' : ''}`}
            disabled={!enabled}
          >
            <Text className={`text-[12px] font-medium${!enabled ? ' text-light-gray' : ' text-dark'}`}>
              {formatTime(openTime)}
            </Text>
          </TouchableOpacity>
          <Text className="text-body text-gray">–</Text>
          <TouchableOpacity
            onPress={() => setShowClosePicker(true)}
            activeOpacity={0.7}
            className={`bg-card rounded-full px-[10px] py-[6px] border border-border${!enabled ? ' opacity-40' : ''}`}
            disabled={!enabled}
          >
            <Text className={`text-[12px] font-medium${!enabled ? ' text-light-gray' : ' text-dark'}`}>
              {formatTime(closeTime)}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showOpenPicker ? (
        <View className="mt-sm">
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
        <View className="mt-sm">
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


