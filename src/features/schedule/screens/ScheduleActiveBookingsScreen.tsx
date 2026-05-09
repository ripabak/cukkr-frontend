import { BookingCard } from "@/src/components/BookingCard";
import { ScreenShell } from "@/src/components/ScreenShell";
import {
  SCHEDULE_STATUS_OPTIONS,
  StatusFilterMenu,
} from "@/src/components/StatusFilterMenu";
import { CalendarModal } from "@/src/features/schedule/components/CalendarModal";
import { DateSelectorPill } from "@/src/features/schedule/components/DateSelectorPill";
import { DayChip, DayChipRow } from "@/src/features/schedule/components/DayChipRow";
import { useActiveBookings } from "@/src/features/schedule/hooks";
import {
  formatTimeLabel,
  getDetailRouteForStatus,
  mapApiStatusToBookingStatus,
  toISODateString,
} from "@/src/features/schedule/utils/booking-formatters";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

function generateDayChips(baseDate: Date): DayChip[] {
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + i);
    return {
      dayLabel: dayLabels[d.getDay()],
      dayNumber: d.getDate(),
      dateKey: toISODateString(d),
    };
  });
}

function formatDatePill(date: Date): string {
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${dayLabels[date.getDay()]}, ${date.getDate()} ${monthShort[date.getMonth()]} ${String(date.getFullYear()).slice(2)}`;
}

export function ScheduleActiveBookingsScreen() {
  const router = useRouter();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedKey, setSelectedKey] = useState(toISODateString(today));
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | "waiting" | "in_progress">("all");

  const days = generateDayChips(today);

  const { data: bookings = [], isLoading } = useActiveBookings(selectedKey, {
    status: statusFilter === "all" ? "all" : (statusFilter),
  });

  const handleSelectDay = (key: string) => {
    setSelectedKey(key);
    const [y, m, d] = key.split("-").map(Number);
    setSelectedDate(new Date(y, m - 1, d));
  };

  const handleCalendarSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedKey(toISODateString(date));
    setCalendarVisible(false);
  };

  const handleBookingPress = (bookingId: string, status: string) => {
    const route = getDetailRouteForStatus(status);
    router.push(`${route}?id=${bookingId}` as any);
  };

  return (
    <ScreenShell
      backgroundColor="#F5F4E8"
      contentStyle={styles.scrollContentPadding}
      headerSlot={
        <>
          <View style={styles.topBar}>
            <DateSelectorPill
              label={formatDatePill(selectedDate)}
              onPress={() => setCalendarVisible(true)}
            />
            <View style={styles.topActions}>
              <TouchableOpacity
                onPress={() => router.push("/history-bookings" as any)}
                activeOpacity={0.8}
                style={styles.iconBtn}
              >
                <Ionicons name="clipboard-outline" size={20} color="#1A1A1A" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/new-appointment" as any)}
                activeOpacity={0.8}
                style={[styles.iconBtn, styles.iconBtnDark]}
              >
                <Ionicons name="add" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.dayChipsWrapper}>
            <DayChipRow
              days={days}
              selectedKey={selectedKey}
              onSelect={handleSelectDay}
              onShowMore={() => setCalendarVisible(true)}
            />
          </View>
        </>
      }
      overlaySlot={
        filterMenuVisible ? (
          <View style={styles.menuOverlay}>
            <StatusFilterMenu
              visible
              options={SCHEDULE_STATUS_OPTIONS}
              selected={statusFilter}
              onSelect={(value) => setStatusFilter(value as "all" | "waiting" | "in_progress")}
              onClose={() => setFilterMenuVisible(false)}
              style={styles.filterMenuPosition}
            />
          </View>
        ) : null
      }
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Active Booking{" "}
          <Text style={styles.sectionCount}>({bookings.length})</Text>
        </Text>
        <TouchableOpacity
          onPress={() => setFilterMenuVisible(true)}
          activeOpacity={0.8}
          style={styles.filterPill}
        >
          <Text style={styles.filterLabel}>
            {SCHEDULE_STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "All"}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {bookings.map((booking, i) => {
          const totalDuration = booking.serviceNames.length > 0 ? 30 : 0;
          const timeRef = booking.scheduledAt ?? booking.createdAt;
          return (
            <BookingCard
              key={booking.id}
              customerName={booking.customerName}
              barberName={booking.barber?.name ?? "—"}
              timeLabel={formatTimeLabel(timeRef)}
              duration={`${totalDuration} mins`}
              status={mapApiStatusToBookingStatus(booking.status)}
              onPress={() => handleBookingPress(booking.id, booking.status)}
              style={i < bookings.length - 1 ? styles.cardMargin : undefined}
            />
          );
        })}
        {!isLoading && bookings.length === 0 ? (
          <Text style={styles.emptyText}>No bookings for this date.</Text>
        ) : null}
      </View>

      <CalendarModal
        visible={calendarVisible}
        selectedDate={selectedDate}
        disablePast={false}
        onSelect={handleCalendarSelect}
        onClose={() => setCalendarVisible(false)}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  topActions: {
    flexDirection: "row",
    gap: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBtnDark: {
    backgroundColor: "#1A1A1A",
  },
  dayChipsWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  sectionCount: {
    fontWeight: "400",
    color: "#666666",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  list: {
    gap: 0,
  },
  cardMargin: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    color: "#666666",
  },
  scrollContentPadding: {
    paddingBottom: 100,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  filterMenuPosition: {
    top: 180,
    right: 20,
  },
});
