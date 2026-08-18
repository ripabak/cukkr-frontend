import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AppText } from "@/src/components/AppText";
import { BottomSheet } from "@/src/components/BottomSheet";
import { useI18nContext } from "@/src/lib/i18n/provider";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

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
            <AppText
              style={[
                pickerStyles.itemText,
                index === selectedIndex && pickerStyles.itemTextSelected,
              ]}
            >
              {renderItem(item)}
            </AppText>
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
    color: Colors.text.muted,
    fontWeight: "400",
  },
  itemTextSelected: {
    fontSize: 22,
    color: Colors.text.primary,
    fontWeight: "600",
  },
  selectionBar: {
    position: "absolute",
    top: ITEM_HEIGHT,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border.default,
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
  const { t } = useI18nContext();
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

  const safeHourIdx = Math.min(hourIndex, validHours.length - 1);
  const safeMinIdx = Math.min(minuteIndex, validMinutes.length - 1);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose ?? (() => {})}
      title={t("components.timePicker.selectTime")}
      showHandle
      scrollable
      maxHeightFraction={0.92}
    >
      <View style={styles.header}>
        {minTime && maxTime && (
          <View style={styles.rangeChip}>
            <AppText style={styles.rangeText}>
              {formatTimePoint(minTime)} {t("common.to")} {formatTimePoint(maxTime)}
            </AppText>
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
        <AppText style={styles.separator}>:</AppText>
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
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() =>
            onConfirm(
              validHours[safeHourIdx],
              validMinutes[safeMinIdx],
              AM_PM[amPmIndex],
            )
          }
          activeOpacity={0.9}
          style={styles.confirmSurface}
        >
          <Ionicons name="checkmark" size={18} color={Colors.text.primary} />
          <AppText style={styles.confirmText}>{t("common.confirm")}</AppText>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  rangeChip: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: Colors.bg.default,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  rangeText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.text.secondary,
  },
  columns: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  separator: {
    fontSize: 22,
    fontWeight: "600",
    color: Colors.text.primary,
    marginHorizontal: 2,
  },
  footer: {
    marginTop: 10,
    marginBottom: 4,
  },
  confirmSurface: {
    borderRadius: 18,
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: Colors.brand.primary,
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});
