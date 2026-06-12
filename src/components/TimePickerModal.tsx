import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { useFrame } from "./FrameContext";

const ITEM_HEIGHT = 44;
const VISIBLE_COUNT = 3;

interface TimePoint {
  hour24: number;
  minute: number;
}

interface Props {
  visible: boolean;
  initialHour?: number;
  initialMinute?: number;
  initialAmPm?: "AM" | "PM";
  minTime?: TimePoint;
  maxTime?: TimePoint;
  minuteStep?: number;
  onConfirm: (hour: number, minute: number, amPm: "AM" | "PM") => void;
  onClose?: () => void;
  style?: ViewStyle;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const AM_PM: ("AM" | "PM")[] = ["AM", "PM"];

function toHour24(h: number, amPm: "AM" | "PM"): number {
  if (amPm === "AM") return h === 12 ? 0 : h;
  return h === 12 ? 12 : h + 12;
}

function getValidHours(
  amPm: "AM" | "PM",
  minutes: number[],
  min?: TimePoint,
  max?: TimePoint,
): number[] {
  if (!min || !max) return HOURS;
  const minTotal = min.hour24 * 60 + min.minute;
  const maxTotal = max.hour24 * 60 + max.minute;
  return HOURS.filter((h) => {
    const h24 = toHour24(h, amPm);
    return minutes.some((m) => {
      const total = h24 * 60 + m;
      return total >= minTotal && total <= maxTotal;
    });
  });
}

function getValidMinutes(
  hour: number,
  amPm: "AM" | "PM",
  allMinutes: number[],
  min?: TimePoint,
  max?: TimePoint,
): number[] {
  if (!min || !max) return allMinutes;
  const h24 = toHour24(hour, amPm);
  const minTotal = min.hour24 * 60 + min.minute;
  const maxTotal = max.hour24 * 60 + max.minute;
  return allMinutes.filter((m) => {
    const total = h24 * 60 + m;
    return total >= minTotal && total <= maxTotal;
  });
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatTimePoint(tp: TimePoint): string {
  const amPm = tp.hour24 >= 12 ? "PM" : "AM";
  const h = tp.hour24 === 0 ? 12 : tp.hour24 > 12 ? tp.hour24 - 12 : tp.hour24;
  const m = tp.minute < 10 ? `0${tp.minute}` : String(tp.minute);
  return `${h}:${m} ${amPm}`;
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
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      scrollRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }, 100);
    return () => {
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [selectedIndex, items.length]);

  const handleMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    onSelect(clamped);
  };

  return (
    <View style={pickerStyles.col}>
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
            style={pickerStyles.item}
          >
            <Text
              style={[
                pickerStyles.itemText,
                index === selectedIndex && pickerStyles.itemTextSelected,
              ]}
            >
              {renderItem(item)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={[pickerStyles.selectionBar, { pointerEvents: "none" }]} />
    </View>
  );
}

const pickerStyles = StyleSheet.create({
  col: {
    flex: 1,
    alignItems: "center",
    position: "relative",
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  itemText: {
    fontSize: 18,
    color: "#B0ADA0",
    fontWeight: "400",
  },
  itemTextSelected: {
    fontSize: 22,
    color: "#1A1A1A",
    fontWeight: "700",
  },
  selectionBar: {
    position: "absolute",
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E0DDD0",
  },
});

export function TimePickerModal({
  visible,
  initialHour = 9,
  initialMinute = 0,
  initialAmPm = "AM",
  minTime,
  maxTime,
  minuteStep = 15,
  onConfirm,
  onClose,
  style,
}: Props) {
  const MINUTES =
    minuteStep > 1
      ? Array.from(
          { length: Math.ceil(60 / minuteStep) },
          (_, i) => i * minuteStep,
        )
      : Array.from({ length: 60 }, (_, i) => i);

  function computeInitialState() {
    const amPmIdx = initialAmPm === "PM" ? 1 : 0;
    const validHours = getValidHours(initialAmPm, MINUTES, minTime, maxTime);
    const hourIdx = Math.max(0, validHours.indexOf(initialHour));
    const hour = validHours[hourIdx] ?? validHours[0] ?? HOURS[0];
    const validMins = getValidMinutes(
      hour,
      initialAmPm,
      MINUTES,
      minTime,
      maxTime,
    );
    const closestMin =
      validMins.length > 0
        ? validMins.reduce((prev, curr) =>
            Math.abs(curr - initialMinute) < Math.abs(prev - initialMinute)
              ? curr
              : prev,
          )
        : 0;
    const minIdx = Math.max(0, validMins.indexOf(closestMin));
    return { amPmIdx, hourIdx, minIdx };
  }

  const init = computeInitialState();
  const [amPmIndex, setAmPmIndex] = useState(init.amPmIdx);
  const [hourIndex, setHourIndex] = useState(init.hourIdx);
  const [minuteIndex, setMinuteIndex] = useState(init.minIdx);

  useLayoutEffect(() => {
    if (visible) {
      const next = computeInitialState();
      setAmPmIndex(next.amPmIdx);
      setHourIndex(next.hourIdx);
      setMinuteIndex(next.minIdx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, minTime, maxTime]);

  const currentAmPm = AM_PM[amPmIndex];
  const validHours = getValidHours(currentAmPm, MINUTES, minTime, maxTime);
  const currentHour =
    validHours[Math.min(hourIndex, validHours.length - 1)] ?? validHours[0];
  const validMinutes = getValidMinutes(
    currentHour,
    currentAmPm,
    MINUTES,
    minTime,
    maxTime,
  );

  function handleAmPmChange(idx: number) {
    const newAmPm = AM_PM[idx];
    const newValidHours = getValidHours(newAmPm, MINUTES, minTime, maxTime);
    const newHourIdx = Math.min(hourIndex, newValidHours.length - 1);
    const newHour = newValidHours[newHourIdx] ?? newValidHours[0];
    const newValidMins = getValidMinutes(
      newHour,
      newAmPm,
      MINUTES,
      minTime,
      maxTime,
    );
    const newMinIdx = Math.min(minuteIndex, newValidMins.length - 1);
    setAmPmIndex(idx);
    setHourIndex(newHourIdx);
    setMinuteIndex(newMinIdx);
  }

  function handleHourChange(idx: number) {
    const newHour = validHours[idx];
    if (newHour !== undefined) {
      const newValidMins = getValidMinutes(
        newHour,
        currentAmPm,
        MINUTES,
        minTime,
        maxTime,
      );
      setMinuteIndex(Math.min(minuteIndex, newValidMins.length - 1));
    }
    setHourIndex(idx);
  }

  const { frameWidth } = useFrame();

  if (!visible) return null;

  const safeHourIdx = Math.min(hourIndex, validHours.length - 1);
  const safeMinIdx = Math.min(minuteIndex, validMinutes.length - 1);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.container, { maxWidth: frameWidth - 48 }, style]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Time</Text>
            {minTime && maxTime && (
              <View style={styles.rangeChip}>
                <Text style={styles.rangeText}>
                  {formatTimePoint(minTime)} – {formatTimePoint(maxTime)}
                </Text>
              </View>
            )}
          </View>

          {/* Pickers */}
          <View style={styles.columns}>
            <ScrollPicker
              key={validHours.join(",")}
              items={validHours}
              selectedIndex={safeHourIdx}
              onSelect={handleHourChange}
              renderItem={(h) => pad(h as number)}
            />
            <Text style={styles.separator}>:</Text>
            <ScrollPicker
              key={`m-${currentHour}-${currentAmPm}`}
              items={validMinutes}
              selectedIndex={safeMinIdx}
              onSelect={setMinuteIndex}
              renderItem={(m) => pad(m as number)}
            />
            <ScrollPicker
              items={AM_PM}
              selectedIndex={amPmIndex}
              onSelect={handleAmPmChange}
              renderItem={(a) => a as string}
            />
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={() =>
              onConfirm(
                validHours[safeHourIdx],
                validMinutes[safeMinIdx],
                AM_PM[amPmIndex],
              )
            }
            activeOpacity={0.8}
            style={styles.confirmBtn}
          >
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    paddingBottom: 16,
    width: "100%",
    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.15)",
    elevation: 10,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  rangeChip: {
    backgroundColor: Colors.bg.surface,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  rangeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#7A7870",
  },
  columns: {
    flexDirection: "row",
    alignItems: "center",
  },
  separator: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginHorizontal: 2,
  },
  confirmBtn: {
    backgroundColor: "#1A1A1A",
    borderRadius: 14,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  confirmText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
