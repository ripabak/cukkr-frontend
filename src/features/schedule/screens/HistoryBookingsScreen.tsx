import { BookingStatus } from "@/src/components/BookingCard";
import { CalendarModal } from "@/src/components/CalendarModal";
import { DateSelectorPill } from "@/src/components/DateSelectorPill";
import { HistoryBookingRow } from "@/src/components/HistoryBookingRow";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SortMenu } from "@/src/components/SortMenu";
import {
    HISTORY_STATUS_OPTIONS,
    StatusFilterMenu,
} from "@/src/components/StatusFilterMenu";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface HistoryBooking {
  id: string;
  customerName: string;
  barberName: string;
  dateTimeLabel: string;
  duration: string;
  status: BookingStatus;
}

const MOCK_HISTORY: HistoryBooking[] = [
  {
    id: "1",
    customerName: "James Comberan",
    barberName: "Pepe Julian",
    dateTimeLabel: "11 May 2025 8:30",
    duration: "30 mins",
    status: "completed",
  },
  {
    id: "2",
    customerName: "Liam Walker",
    barberName: "Pepe Julian",
    dateTimeLabel: "11 May 2025 8:30",
    duration: "30 mins",
    status: "completed",
  },
  {
    id: "3",
    customerName: "Ethan James",
    barberName: "Pepe Julian",
    dateTimeLabel: "11 May 2025 8:30",
    duration: "30 mins",
    status: "waiting",
  },
  {
    id: "4",
    customerName: "Ethan James",
    barberName: "Pepe Julian",
    dateTimeLabel: "11 May 2025 8:30",
    duration: "30 mins",
    status: "in-progress",
  },
];

const SORT_OPTIONS = [
  { label: "Sort by Recently Added", value: "recent" },
  { label: "Sort by Oldest First", value: "oldest" },
  { label: "Sort by Name", value: "name" },
];

function formatDatePill(date: Date): string {
  const monthShort = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${date.getDate()} ${monthShort[date.getMonth()]} ${date.getFullYear()}`;
}

export function HistoryBookingsScreen() {
  const router = useRouter();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortValue, setSortValue] = useState("recent");
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  const filteredHistory = MOCK_HISTORY.filter((b) =>
    statusFilter === "all" ? true : b.status === statusFilter,
  );

  return (
    <ScreenShell
      backgroundColor="#F5F4E8"
      headerSlot={
        <ScreenHeader
          onBack={() => router.back()}
          rightAction={
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => setStatusMenuVisible(true)}
                activeOpacity={0.8}
                style={styles.iconBtn}
              >
                <Ionicons name="filter-outline" size={18} color="#1A1A1A" />
              </TouchableOpacity>
              <DateSelectorPill
                label={formatDatePill(selectedDate)}
                onPress={() => setCalendarVisible(true)}
              />
            </View>
          }
        />
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
        <Text style={styles.title}>All Booking</Text>
        <TouchableOpacity
          onPress={() => setStatusMenuVisible(true)}
          activeOpacity={0.8}
          style={styles.filterPill}
        >
          <Text style={styles.filterLabel}>
            {HISTORY_STATUS_OPTIONS.find((o) => o.value === statusFilter)
              ?.label ?? "All"}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {filteredHistory.map((booking, i) => (
          <HistoryBookingRow
            key={booking.id}
            customerName={booking.customerName}
            barberName={booking.barberName}
            dateTimeLabel={booking.dateTimeLabel}
            duration={booking.duration}
            status={booking.status}
            onPress={() => router.push("/booking-detail-result" as any)}
            style={
              i < filteredHistory.length - 1 ? styles.rowMargin : undefined
            }
          />
        ))}
      </View>
      <CalendarModal
        visible={calendarVisible}
        selectedDate={selectedDate}
        onSelect={(date) => {
          setSelectedDate(date);
          setCalendarVisible(false);
        }}
        onClose={() => setCalendarVisible(false)}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0DDD0",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
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
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  statusMenuPosition: {
    top: 100,
    right: 20,
  },
});
