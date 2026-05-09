import { BookingCard, BookingStatus } from "@/src/components/BookingCard";
import { CalendarModal } from "@/src/components/CalendarModal";
import { DateSelectorPill } from "@/src/components/DateSelectorPill";
import { DayChip, DayChipRow } from "@/src/components/DayChipRow";
import { ScreenShell } from "@/src/components/ScreenShell";
import {
  SCHEDULE_STATUS_OPTIONS,
  StatusFilterMenu,
} from "@/src/components/StatusFilterMenu";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Booking {
  id: string;
  customerName: string;
  barberName: string;
  timeLabel: string;
  duration: string;
  status: BookingStatus;
}

const MOCK_BOOKINGS: Booking[] = [
  {
    id: "1",
    customerName: "Ethan James",
    barberName: "Pepe Julian",
    timeLabel: "12m ago",
    duration: "30 mins",
    status: "waiting",
  },
  {
    id: "2",
    customerName: "Ethan James",
    barberName: "Pepe Julian",
    timeLabel: "12m ago",
    duration: "30 mins",
    status: "in-progress",
  },
  {
    id: "3",
    customerName: "James Cook",
    barberName: "Pepe Julian",
    timeLabel: "5m ago",
    duration: "45 mins",
    status: "waiting",
  },
];

function generateDayChips(baseDate: Date): DayChip[] {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return {
      dayLabel: dayLabels[d.getDay()],
      dayNumber: d.getDate(),
      dateKey: d.toISOString().split("T")[0],
    };
  });
}

function formatDatePill(date: Date): string {
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
  return `${dayLabels[date.getDay()]}, ${date.getDate()} ${monthShort[date.getMonth()]} ${String(date.getFullYear()).slice(2)}`;
}

export function ScheduleActiveBookingsScreen() {
  const router = useRouter();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedKey, setSelectedKey] = useState(
    today.toISOString().split("T")[0],
  );
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const days = generateDayChips(today);

  const filteredBookings = MOCK_BOOKINGS.filter((b) =>
    statusFilter === "all" ? true : b.status === statusFilter,
  );

  const handleSelectDay = (key: string) => {
    setSelectedKey(key);
    const date = new Date(key);
    setSelectedDate(date);
  };

  const handleCalendarSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedKey(date.toISOString().split("T")[0]);
    setCalendarVisible(false);
  };

  return (
    <ScreenShell
      backgroundColor="#F5F4E8"
      contentStyle={{ paddingBottom: 100 }}
      headerSlot={
        <>
          {/* Top bar */}
          <View className="flex-row items-center justify-between px-xl pt-md pb-sm">
            <DateSelectorPill
              label={formatDatePill(selectedDate)}
              onPress={() => setCalendarVisible(true)}
            />
            <View className="flex-row gap-[10px]">
              <TouchableOpacity
                onPress={() => setCalendarVisible(true)}
                activeOpacity={0.8}
                className="w-11 h-11 rounded-full bg-card items-center justify-center"
              >
                <Ionicons name="calendar" size={20} color="#1A1A1A" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/schedule-new-appointment" as any)}
                activeOpacity={0.8}
                className="w-11 h-11 rounded-full bg-dark items-center justify-center"
              >
                <Ionicons name="add" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
          {/* Day chips */}
          <View className="px-xl pb-sm">
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
          <View className="absolute inset-0 z-50">
            <StatusFilterMenu
              visible
              options={SCHEDULE_STATUS_OPTIONS}
              selected={statusFilter}
              onSelect={setStatusFilter}
              onClose={() => setFilterMenuVisible(false)}
              style={{ top: 180, right: 20 }}
            />
          </View>
        ) : null
      }
    >
      <View className="flex-row items-center justify-between mb-[14px] mt-sm">
        <Text className="text-[22px] font-bold text-dark">
          Active Booking{" "}
          <Text className="font-normal text-gray">({filteredBookings.length})</Text>
        </Text>
        <TouchableOpacity
          onPress={() => setFilterMenuVisible(true)}
          activeOpacity={0.8}
          className="flex-row items-center bg-card rounded-full px-[14px] py-sm gap-xs"
        >
          <Text className="text-sm font-medium text-dark">
            {SCHEDULE_STATUS_OPTIONS.find((o) => o.value === statusFilter)
              ?.label ?? "All"}
          </Text>
          <Ionicons name="chevron-down" size={14} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <View>
        {filteredBookings.map((booking, i) => (
          <BookingCard
            key={booking.id}
            customerName={booking.customerName}
            barberName={booking.barberName}
            timeLabel={booking.timeLabel}
            duration={booking.duration}
            status={booking.status}
            onPress={() => router.push(`/booking-detail-waiting` as any)}
            style={
              i < filteredBookings.length - 1 ? { marginBottom: 12 } : undefined
            }
          />
        ))}
      </View>
      <CalendarModal
        visible={calendarVisible}
        selectedDate={selectedDate}
        onSelect={handleCalendarSelect}
        onClose={() => setCalendarVisible(false)}
      />
    </ScreenShell>
  );
}
