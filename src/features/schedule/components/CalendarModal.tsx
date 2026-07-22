import { useI18nContext } from "@/src/lib/i18n/provider";
import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { useFrame } from "@/src/components/FrameContext";

interface DayHourInfo {
  dayOfWeek: number;
  isOpen: boolean;
}

interface Props {
  visible: boolean;
  selectedDate?: Date;
  openHours?: DayHourInfo[];
  disablePast?: boolean;
  minDate?: Date;
  maxDate?: Date;
  highlightDates?: Set<string>;
  waitingDates?: Set<string>;
  onSelect: (date: Date) => void;
  onClose: () => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export function CalendarModal({
  visible,
  selectedDate,
  openHours,
  disablePast = true,
  minDate,
  maxDate,
  highlightDates,
  waitingDates,
  onSelect,
  onClose,
}: Props) {
  const { t, language } = useI18nContext();
  const { frameWidth } = useFrame();
  const today = new Date();

  const locale = language === 'id' ? 'id-ID' : 'en-US';

  const DAY_LABELS = React.useMemo(() =>
    Array.from({ length: 7 }, (_, i) =>
      new Intl.DateTimeFormat(locale, { weekday: 'short' })
        .format(new Date(2024, 0, i + 1))
        .toUpperCase(),
    ),
  [locale]);

  const localizedMonths = React.useMemo(() =>
    Array.from({ length: 12 }, (_, i) =>
      new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2024, i, 1)),
    ),
  [locale]);

  const [viewYear, setViewYear] = useState(
    selectedDate?.getFullYear() ?? today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    selectedDate?.getMonth() ?? today.getMonth(),
  );

  const closedDaySet = React.useMemo(() => {
    const s = new Set<number>();
    (openHours ?? []).forEach((d) => {
      if (!d.isOpen) s.add(d.dayOfWeek);
    });
    return s;
  }, [openHours]);

  const hasOpenHours = openHours !== undefined && openHours.length > 0;

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

  function toDayKey(day: number): string {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function isDayPast(day: number): boolean {
    const date = new Date(viewYear, viewMonth, day);
    if (disablePast && date < today) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  }

  function isDayClosed(day: number): boolean {
    if (!hasOpenHours) return false;
    return closedDaySet.has(new Date(viewYear, viewMonth, day).getDay());
  }

  function isToday(day: number): boolean {
    return (
      viewYear === today.getFullYear() &&
      viewMonth === today.getMonth() &&
      day === today.getDate()
    );
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
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.card, { maxWidth: frameWidth - 48 }]}
        >
          {/* Month navigation */}
          <View style={styles.monthRow}>
            <TouchableOpacity
              onPress={prevMonth}
              activeOpacity={0.7}
              style={styles.navBtn}
            >
              <Ionicons
                name="chevron-back"
                size={18}
                color={Colors.text.primary}
              />
            </TouchableOpacity>
            <AppText style={styles.monthTitle}>
              {localizedMonths[viewMonth]} {viewYear}
            </AppText>
            <TouchableOpacity
              onPress={nextMonth}
              activeOpacity={0.7}
              style={styles.navBtn}
            >
              <Ionicons
                name="chevron-forward"
                size={18}
                color={Colors.text.primary}
              />
            </TouchableOpacity>
          </View>

          {/* Day labels */}
          <View style={styles.dayLabelRow}>
            {DAY_LABELS.map((d, i) => (
              <AppText
                key={d}
                style={[
                  styles.dayLabel,
                  hasOpenHours && closedDaySet.has(i) && styles.dayLabelClosed,
                ]}
              >
                {d}
              </AppText>
            ))}
          </View>

          {/* Calendar grid */}
          {rows.map((row, ri) => (
            <View key={ri} style={styles.week}>
              {row.map((day, di) => {
                if (day === null)
                  return <View key={di} style={styles.dayCell} />;

                const past = isDayPast(day);
                const closed = isDayClosed(day);
                const disabled = past || closed;
                const selected = isSelected(day);
                const todayMark = isToday(day);
                const hasRequest =
                  !selected && highlightDates?.has(toDayKey(day));
                const hasWaiting =
                  !selected && waitingDates?.has(toDayKey(day));

                return (
                  <View key={di} style={styles.dayCell}>
                    <TouchableOpacity
                      onPress={
                        disabled
                          ? undefined
                          : () => onSelect(new Date(viewYear, viewMonth, day))
                      }
                      activeOpacity={disabled ? 1 : 0.8}
                      style={[
                        styles.dayBtn,
                        selected && styles.dayBtnSelected,
                        todayMark && !selected && styles.dayBtnToday,
                      ]}
                    >
                      <AppText
                        style={[
                          styles.dayText,
                          selected && styles.dayTextSelected,
                          past && styles.dayTextPast,
                          closed && !past && styles.dayTextClosed,
                        ]}
                      >
                        {day}
                      </AppText>
                      {closed && !past && <View style={styles.closedDot} />}
                      <View style={styles.dotsRow}>
                        {hasRequest && <View style={styles.requestDot} />}
                        {hasWaiting && <View style={styles.waitingDot} />}
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ))}

          {/* Legend */}
          {(hasOpenHours && closedDaySet.size > 0) ||
          highlightDates?.size ||
          waitingDates?.size ? (
            <View style={styles.legend}>
              {hasOpenHours && closedDaySet.size > 0 && (
                <>
                  <View style={styles.legendDot} />
                  <AppText style={styles.legendText}>{t("calendar.closedDay")}</AppText>
                </>
              )}
              {highlightDates?.size ? (
                <>
                  <View
                    style={[
                      styles.legendRequestDot,
                      hasOpenHours && closedDaySet.size > 0
                        ? undefined
                        : styles.legendDotFirst,
                    ]}
                  />
                  <AppText style={styles.legendText}>{t("calendar.hasRequests")}</AppText>
                </>
              ) : null}
              {waitingDates?.size ? (
                <>
                  <View style={styles.legendWaitingDot} />
                  <AppText style={styles.legendText}>{t("calendar.hasWaiting")}</AppText>
                </>
              ) : null}
            </View>
          ) : null}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    alignSelf: "center",
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  navBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  dayLabelRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 11,
    fontWeight: "600",
    color: "#AAAAAA",
  },
  dayLabelClosed: {
    color: "#DDDBCD",
  },
  week: {
    flexDirection: "row",
    marginBottom: 4,
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  dayBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },
  dayBtnSelected: {
    backgroundColor: "#E63030",
  },
  dayBtnToday: {
    borderWidth: 1.5,
    borderColor: "#E63030",
  },
  dayText: {
    fontSize: 14,
    color: "#1A1A1A",
  },
  dayTextSelected: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  dayTextPast: {
    color: "#D5D3C8",
  },
  dayTextClosed: {
    color: "#C8C5BA",
  },
  closedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D0CEC5",
    position: "absolute",
    bottom: 2,
  },
  dotsRow: {
    flexDirection: "row",
    gap: 2,
    position: "absolute",
    bottom: 2,
  },
  requestDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E63030",
  },
  waitingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.brand.primary,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0EDE5",
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D0CEC5",
  },
  legendDotFirst: {
    marginLeft: 0,
  },
  legendRequestDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E63030",
    marginLeft: 12,
  },
  legendWaitingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.brand.primary,
    marginLeft: 12,
  },
  legendText: {
    fontSize: 12,
    color: "#9E9B90",
  },
});
