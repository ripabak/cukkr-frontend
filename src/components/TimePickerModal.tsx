import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native";

const ITEM_HEIGHT = 44;
const VISIBLE_COUNT = 3;

interface Props {
  visible: boolean;
  initialHour?: number;
  initialMinute?: number;
  initialAmPm?: "AM" | "PM";
  onConfirm: (hour: number, minute: number, amPm: "AM" | "PM") => void;
  onClose?: () => void;
  style?: ViewStyle;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);
const AM_PM: ("AM" | "PM")[] = ["AM", "PM"];

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function ScrollPicker({
  items,
  selectedIndex,
  onSelect,
  renderItem,
}: {
  items: (number | string)[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  renderItem: (item: number | string) => string;
}) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }, 100);
  }, [selectedIndex]);

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    onSelect(clamped);
  };

  return (
    <View className="flex-1 items-center relative">
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleMomentumEnd}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT }}
        style={{ height: ITEM_HEIGHT * VISIBLE_COUNT }}
      >
        {items.map((item, index) => (
          <TouchableOpacity
            key={String(index)}
            onPress={() => {
              scrollRef.current?.scrollTo({
                y: index * ITEM_HEIGHT,
                animated: true,
              });
              onSelect(index);
            }}
            className="items-center justify-center"
            style={{ height: ITEM_HEIGHT }}
          >
            <Text
              className={`font-normal${index === selectedIndex ? ' text-[22px] text-dark font-bold' : ' text-[18px] text-light-gray'}`}
            >
              {renderItem(item)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View
        style={{ position: 'absolute', top: ITEM_HEIGHT, left: 0, right: 0, height: ITEM_HEIGHT, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E0DDD0' }}
        pointerEvents="none"
      />
    </View>
  );
}


export function TimePickerModal({
  visible,
  initialHour = 9,
  initialMinute = 0,
  initialAmPm = "AM",
  onConfirm,
  onClose,
  style,
}: Props) {
  const [hourIndex, setHourIndex] = useState(
    HOURS.indexOf(initialHour) >= 0 ? HOURS.indexOf(initialHour) : 0,
  );
  const [minuteIndex, setMinuteIndex] = useState(initialMinute);
  const [amPmIndex, setAmPmIndex] = useState(initialAmPm === "PM" ? 1 : 0);

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        className="flex-1 bg-black/20 justify-center items-center px-xxl"
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} className="bg-card rounded-[20px] p-lg flex-row items-center gap-sm" style={[{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 8 }, style]}>
          <View className="flex-1 flex-row items-center">
            <ScrollPicker
              items={HOURS}
              selectedIndex={hourIndex}
              onSelect={setHourIndex}
              renderItem={(h) => pad(h as number)}
            />
            <Text className="text-[22px] font-bold text-dark mx-[2px]">:</Text>
            <ScrollPicker
              items={MINUTES}
              selectedIndex={minuteIndex}
              onSelect={setMinuteIndex}
              renderItem={(m) => pad(m as number)}
            />
            <ScrollPicker
              items={AM_PM}
              selectedIndex={amPmIndex}
              onSelect={setAmPmIndex}
              renderItem={(a) => a as string}
            />
          </View>
          <TouchableOpacity
            onPress={() =>
              onConfirm(
                HOURS[hourIndex],
                MINUTES[minuteIndex],
                AM_PM[amPmIndex],
              )
            }
            activeOpacity={0.8}
            className="w-11 h-11 rounded-full bg-dark items-center justify-center"
          >
            <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}


