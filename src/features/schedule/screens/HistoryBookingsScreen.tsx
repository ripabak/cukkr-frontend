import { CalendarModal } from "@/src/components/CalendarModal";
import { DateSelectorPill } from "@/src/components/DateSelectorPill";
import { HistoryBookingRow } from "@/src/components/HistoryBookingRow";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SortMenu } from "@/src/components/SortMenu";
import {
  HISTORY_STATUS_OPTIONS,
  StatusFilterMenu,
} from "@/src/components/StatusFilterMenu";
import { useBookings } from "@/src/features/schedule/hooks";
import {
  mapApiStatusToBookingStatus,
  toISODateString,
} from "@/src/features/schedule/utils/booking-formatters";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SORT_OPTIONS = [
  { label: "Sort by Recently Added", value: "recently_added" },
  { label: "Sort by Oldest First", value: "oldest_first" },
];

function formatDatePill(date: Date): string {
  const monthShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${date.getDate()} ${monthShort[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDateTimeLabel(date: Date | string | null): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  const monthShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const h = d.getHours();
  const m = d.getMinutes();
  const mm = m < 10 ? `0${m}` : String(m);
  return `${d.getDate()} ${monthShort[d.getMonth()]} ${d.getFullYear()} ${h}:${mm}`;
}

export function HistoryBookingsScreen() {
  const router = useRouter();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortValue, setSortValue] = useState("recently_added");
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  const dateKey = toISODateString(selectedDate);

  const { data: bookings = [], isLoading } = useBookings(dateKey, {
    status: statusFilter === "all" ? "all" : (statusFilter as any),
    sort: sortValue as "oldest_first" | "recently_added",
  });

  const handleBookingPress = (id: string) => {
    router.push(`/booking-detail-result?id=${id}` as any);
  };

  return (
    <ScreenShell
      backgroundColor="#F5F4E8"
      headerSlot={
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.topActions}>
            <TouchableOpacity
              onPress={() => setSortMenuVisible(true)}
              activeOpacity={0.8}
              style={styles.iconBtn}
            >
              <Ionicons name="swap-vertical-outline" size={18} color="#1A1A1A" />
            </TouchableOpacity>
            <DateSelectorPill
              label={formatDatePill(selectedDate)}
              onPress={() => setCalendarVisible(true)}
            />
          </View>
        </View>
      }
      overlaySlot={
        <>
          {statusMenuVisible ? (
            <View style={styles.menuOverlay}>
              <StatusFilterMenu
                visible
                options={HISTORY_STATUS_OPTIONS}
                selected={statusFilter}
                onSelect={setStatusFilter}
                onClose={() => setStatusMenuVisible(false)}
                style={styles.statusMenuPosition}
              />
            </View>
          ) : null}
          {sortMenuVisible ? (
            <View style={styles.menuOverlay}>
              <SortMenu
                visible
                options={SORT_OPTIONS}
                selected={sortValue}
                onSelect={setSortValue}
                onClose={() => setSortMenuVisible(false)}
              />
            </View>
          ) : null}
        </>
      }
    >
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>
          All Booking{" "}
          <Text style={styles.titleCount}>({bookings.length})</Text>
        </Text>
        <TouchableOpacity
          onPress={() => setStatusMenuVisible(true)}
          activeOpacity={0.8}
          style={styles.filterPill}
        >
          <Text style={styles.filterLabel}>
            {HISTORY_STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "All"}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="small" color="#1A1A1A" style={styles.loader} />
      ) : (
        <View style={styles.list}>
          {bookings.map((booking, i) => (
            <HistoryBookingRow
              key={booking.id}
              customerName={booking.customerName}
              barberName={booking.barber?.name ?? "—"}
              dateTimeLabel={formatDateTimeLabel(booking.scheduledAt ?? booking.createdAt)}
              duration="30 mins"
              status={mapApiStatusToBookingStatus(booking.status)}
              onPress={() => handleBookingPress(booking.id)}
              style={i < bookings.length - 1 ? styles.rowMargin : undefined}
            />
          ))}
          {bookings.length === 0 && !isLoading ? (
            <Text style={styles.emptyText}>No bookings for this date.</Text>
          ) : null}
        </View>
      )}

      <CalendarModal
        visible={calendarVisible}
        selectedDate={selectedDate}
        onSelect={(date) => {
          setSelectedDate(date);
          setCalendarVisible(false);
        }}
        disablePast={false}
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
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  titleCount: {
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
  list: {},
  rowMargin: {
    marginBottom: 12,
  },
  loader: {
    marginTop: 40,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    color: "#666666",
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  statusMenuPosition: {
    top: 80,
    right: 20,
  },
});
