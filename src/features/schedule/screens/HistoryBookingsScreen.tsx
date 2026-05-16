import { Colors } from '@/src/theme/colors';
import { ScreenShell } from "@/src/components/ScreenShell";
import { SortMenu } from "@/src/components/SortMenu";
import {
  HISTORY_STATUS_OPTIONS,
  StatusFilterMenu,
} from "@/src/components/StatusFilterMenu";
import { CalendarModal } from "@/src/features/schedule/components/CalendarModal";
import { DateSelectorPill } from "@/src/features/schedule/components/DateSelectorPill";
import { HistoryBookingRow } from "@/src/features/schedule/components/HistoryBookingRow";
import { useBookings } from "@/src/features/schedule/hooks";
import {
  mapApiStatusToBookingStatus,
} from "@/src/features/schedule/utils/booking-formatters";
import { formatDateTime, toApiDate } from "@/src/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

export function HistoryBookingsScreen() {
  const router = useRouter();
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortValue, setSortValue] = useState("recently_added");
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [statusMenuTop, setStatusMenuTop] = useState(0);
  const [sortMenuTop, setSortMenuTop] = useState(0);
  const statusBtnRef = useRef<View>(null);
  const sortBtnRef = useRef<View>(null);

  const handleOpenStatusMenu = () => {
    statusBtnRef.current?.measure((_x: number, _y: number, _w: number, height: number, _px: number, pageY: number) => {
      setStatusMenuTop(pageY + height + 4);
    });
    setStatusMenuVisible(true);
  };

  const handleOpenSortMenu = () => {
    sortBtnRef.current?.measure((_x: number, _y: number, _w: number, height: number, _px: number, pageY: number) => {
      setSortMenuTop(pageY + height + 4);
    });
    setSortMenuVisible(true);
  };

  const dateKey = toApiDate(selectedDate);

  const { data: bookings = [], isLoading } = useBookings(dateKey, {
    status: statusFilter === "all" ? "all" : (statusFilter as any),
    sort: sortValue as "oldest_first" | "recently_added",
  });

  const handleBookingPress = (id: string) => {
    router.push(`/booking-detail-result?id=${id}`);
  };

  return (
    <ScreenShell
      backgroundColor={Colors.bg.default}
      headerSlot={
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          <View style={styles.topActions}>
            <TouchableOpacity
              ref={sortBtnRef}
              onPress={handleOpenSortMenu}
              activeOpacity={0.8}
              style={styles.iconBtn}
            >
              <Ionicons name="filter" size={18} color={Colors.text.primary} />
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
                style={{ top: statusMenuTop, right: 20 }}
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
                style={{ top: sortMenuTop, right: 20 }}
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
          ref={statusBtnRef}
          onPress={handleOpenStatusMenu}
          activeOpacity={0.8}
          style={styles.filterPill}
        >
          <Text style={styles.filterLabel}>
            {HISTORY_STATUS_OPTIONS.find((o) => o.value === statusFilter)?.label ?? "All"}
          </Text>
          <Ionicons name="chevron-down" size={14} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {bookings.map((booking, i) => (
          <HistoryBookingRow
            key={booking.id}
            customerName={booking.customerName}
            barberName={booking.barber?.name ?? "—"}
            dateTimeLabel={formatDateTime(
              booking.scheduledAt
                ? new Date(booking.scheduledAt as Date)
                : new Date(booking.createdAt as Date)
            )}
            duration="30 mins"
            status={mapApiStatusToBookingStatus(booking.status)}
            bookingType={booking.type}
            onPress={() => handleBookingPress(booking.id)}
            style={i < bookings.length - 1 ? styles.rowMargin : undefined}
          />
        ))}
        {!isLoading && bookings.length === 0 ? (
          <Text style={styles.emptyText}>No bookings for this date.</Text>
        ) : null}
      </View>

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
    backgroundColor: Colors.bg.default,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.06)',
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
    backgroundColor: Colors.bg.default,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.06)',
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
    color: Colors.text.primary,
  },
  titleCount: {
    fontWeight: "400",
    color: Colors.text.secondary,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bg.default,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 4,
    boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  list: {},
  rowMargin: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    color: Colors.text.secondary,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
});
