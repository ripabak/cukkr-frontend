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
import { Text, TouchableOpacity, View } from "react-native";

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
            <View className="flex-row items-center gap-sm">
              <TouchableOpacity
                onPress={() => setStatusMenuVisible(true)}
                activeOpacity={0.8}
                className="w-9 h-9 rounded-full bg-card border border-border items-center justify-center"
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
            <View className="absolute inset-0 z-50">
              <StatusFilterMenu
                visible
                options={HISTORY_STATUS_OPTIONS}
                selected={statusFilter}
                onSelect={setStatusFilter}
                onClose={() => setStatusMenuVisible(false)}
                style={{ top: 100, right: 20 }}
              />
            </View>
          ) : null}
          {sortMenuVisible ? (
            <View className="absolute inset-0 z-50">
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
      <View className="flex-row items-center justify-between mb-lg mt-sm">
        <Text className="text-[26px] font-bold text-dark">All Booking</Text>
        <TouchableOpacity
          onPress={() => setStatusMenuVisible(true)}
          activeOpacity={0.8}
          className="flex-row items-center bg-card rounded-full px-[14px] py-sm gap-xs"
        >
          <Text className="text-sm font-medium text-dark">
            {HISTORY_STATUS_OPTIONS.find((o) => o.value === statusFilter)
              ?.label ?? "All"}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <View>
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
              i < filteredHistory.length - 1 ? { marginBottom: 12 } : undefined
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
