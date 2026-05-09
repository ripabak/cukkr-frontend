import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { DayHoursRow } from '@/src/components/DayHoursRow';
import { PrimaryButton } from '@/src/components/PrimaryButton';

interface TimeValue {
  hour: number;
  minute: number;
  amPm: 'AM' | 'PM';
}

interface DayConfig {
  key: string;
  label: string;
  enabled: boolean;
  open: TimeValue;
  close: TimeValue;
}

const DEFAULT_OPEN: TimeValue = { hour: 9, minute: 0, amPm: 'AM' };
const DEFAULT_CLOSE: TimeValue = { hour: 9, minute: 0, amPm: 'PM' };

const INITIAL_DAYS: DayConfig[] = [
  { key: 'mon', label: 'Mon', enabled: true, open: DEFAULT_OPEN, close: DEFAULT_CLOSE },
  { key: 'tue', label: 'Tue', enabled: true, open: DEFAULT_OPEN, close: DEFAULT_CLOSE },
  { key: 'wed', label: 'Wed', enabled: true, open: DEFAULT_OPEN, close: DEFAULT_CLOSE },
  { key: 'thu', label: 'Thu', enabled: true, open: DEFAULT_OPEN, close: DEFAULT_CLOSE },
  { key: 'fri', label: 'Fri', enabled: true, open: DEFAULT_OPEN, close: DEFAULT_CLOSE },
  { key: 'sat', label: 'Sat', enabled: true, open: DEFAULT_OPEN, close: DEFAULT_CLOSE },
  { key: 'sun', label: 'Sun', enabled: false, open: DEFAULT_OPEN, close: DEFAULT_CLOSE },
];

export function OpenHoursScreen() {
  const router = useRouter();
  const [days, setDays] = useState<DayConfig[]>(INITIAL_DAYS);

  const updateDay = (key: string, updates: Partial<DayConfig>) => {
    setDays((prev) => prev.map((d) => (d.key === key ? { ...d, ...updates } : d)));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EEEEE0' }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader onBack={() => router.back()} />
        <Text className="text-[28px] font-bold text-dark mt-sm">Open Hours</Text>
        <Text className="text-[14px] text-gray mt-[4px] mb-xl">Set your barbershop operating hours for each day</Text>

        <View className="bg-info-row-bg rounded-lg mb-xxl">
          {days.map((day, index) => (
            <DayHoursRow
              key={day.key}
              day={day.label}
              enabled={day.enabled}
              onEnabledChange={(v) => updateDay(day.key, { enabled: v })}
              openTime={day.open}
              closeTime={day.close}
              onOpenTimeChange={(t) => updateDay(day.key, { open: t })}
              onCloseTimeChange={(t) => updateDay(day.key, { close: t })}
              isLast={index === days.length - 1}
            />
          ))}
        </View>

        <PrimaryButton
          label="Save Hours"
          onPress={() => router.back()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

