import { BookingCard } from "@/src/components/BookingCard";
import { ScreenShell } from "@/src/components/ScreenShell";
import {
  SCHEDULE_STATUS_OPTIONS,
  StatusFilterMenu,
} from "@/src/components/StatusFilterMenu";
import { CalendarModal } from "@/src/features/schedule/components/CalendarModal";
import { DateSelectorPill } from "@/src/features/schedule/components/DateSelectorPill";
import {
  DayChip,
  DayChipRow,
} from "@/src/features/schedule/components/DayChipRow";
import {
  useBookingRequestedDates,
  useBookings,
} from "@/src/features/schedule/hooks";
import {
  formatDuration,
  mapApiStatusToBookingStatus,
  sortBookingsQueue,
} from "@/src/features/schedule/utils/booking-formatters";
import { formatTime12h, toApiDate } from "@/src/utils/date";
import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface RequestCardProps {
  id: string;
  customerName: string;
  barberName: string;
  timeLabel: string;
  bookingType?: string;
  onPress: () => void;
  onAccept: () => void;
  onDecline: () => void;
}

function RequestCard({
  customerName,
  barberName,
  timeLabel,
  bookingType,
  onPress,
  onAccept,
  onDecline,
}: RequestCardProps) {
  const iconName = bookingType === "walk_in" ? "walk" : "calendar";
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={reqStyles.card}
    >
      <View style={reqStyles.iconRow}>
        <View style={reqStyles.iconCircle}>
          <Ionicons name={iconName} size={16} color={Colors.text.secondary} />
        </View>
        <Text style={reqStyles.time}>{timeLabel}</Text>
      </View>
      <Text style={reqStyles.customerName} numberOfLines={1}>
        {customerName}
      </Text>
      <View style={reqStyles.barberRow}>
        <Ionicons name="cut" size={11} color={Colors.text.muted} />
        <Text style={reqStyles.barberName} numberOfLines={1}>
          {" "}
          {barberName}
        </Text>
      </View>
      <View style={reqStyles.actions}>
        <TouchableOpacity
          onPress={onDecline}
          activeOpacity={0.8}
          style={reqStyles.declineBtn}
        >
          <Text style={reqStyles.declineText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onAccept}
          activeOpacity={0.8}
          style={reqStyles.acceptBtn}
        >
          <Text style={reqStyles.acceptText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function generateDayChips(baseDate: Date): DayChip[] {
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date(
      baseDate.getFullYear(),
      baseDate.getMonth(),
      baseDate.getDate() + i,
    );
    return {
      dayLabel: dayLabels[d.getDay()],
      dayNumber: d.getDate(),
      dateKey: toApiDate(d),
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
  const [selectedKey, setSelectedKey] = useState(toApiDate(today));
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "waiting" | "in_progress" | "completed" | "cancelled"
  >("all");
  const [menuTop, setMenuTop] = useState(0);
  const filterBtnRef = useRef<View>(null);
  const handleOpenFilterMenu = () => {
    filterBtnRef.current?.measure(
      (
        _x: number,
        _y: number,
        _w: number,
        height: number,
        _px: number,
        pageY: number,
      ) => {
        setMenuTop(pageY + height + 4);
      },
    );
    setFilterMenuVisible(true);
  };

  const days = generateDayChips(today);

  const reqDateFrom = toApiDate(today);
  const reqDateTo = toApiDate(
    new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()),
  );
  const { data: requestedList = [] } = useBookingRequestedDates(
    reqDateFrom,
    reqDateTo,
  );
  const requestedDateSet = React.useMemo(() => {
    const s = new Set<string>();
    requestedList.forEach((b) => {
      s.add(toApiDate(new Date((b.scheduledAt ?? b.createdAt) as Date)));
    });
    return s;
  }, [requestedList]);

  const { data: rawBookings = [], isLoading } = useBookings(selectedKey, {
    status: "all",
  });
  const requestedBookings = rawBookings.filter((b) => b.status === "requested");
  const bookings = React.useMemo(() => {
    const filtered = rawBookings.filter((b) => {
      if (b.status === "requested") return false;
      if (statusFilter === "all") return true;
      return b.status === statusFilter;
    });
    return sortBookingsQueue(filtered);
  }, [rawBookings, statusFilter]);

  const handleSelectDay = (key: string) => {
    setSelectedKey(key);
    const [y, m, d] = key.split("-").map(Number);
    setSelectedDate(new Date(y, m - 1, d));
  };

  const handleCalendarSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedKey(toApiDate(date));
    setCalendarVisible(false);
  };

  const handleBookingPress = (bookingId: string) => {
    router.push({ pathname: "/d/booking-detail", params: { id: bookingId } });
  };

  return (
    <ScreenShell
      backgroundColor={Colors.bg.default}
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
                onPress={() => router.push("/d/new-appointment")}
                activeOpacity={0.8}
                style={[styles.iconBtn, styles.iconBtnDark]}
              >
                <Ionicons name="add" size={22} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.dayChipsWrapper}>
            <DayChipRow
              days={days}
              selectedKey={selectedKey}
              onSelect={handleSelectDay}
              onShowMore={() => setCalendarVisible(true)}
              highlightDates={requestedDateSet}
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
              onSelect={(value) =>
                setStatusFilter(
                  value as
                    | "all"
                    | "waiting"
                    | "in_progress"
                    | "completed"
                    | "cancelled",
                )
              }
              onClose={() => setFilterMenuVisible(false)}
              style={{ top: menuTop, right: 20 }}
            />
          </View>
        ) : null
      }
    >
      {requestedBookings.length > 0 && (
        <View style={styles.requestsSection}>
          <Text style={styles.requestsTitle}>
            Requests{" "}
            <Text style={styles.sectionCount}>
              ({requestedBookings.length})
            </Text>
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.requestsScroll}
          >
            {requestedBookings.map((booking) => {
              const timeDate =
                booking.type === "appointment" && booking.scheduledAt
                  ? new Date(booking.scheduledAt as Date)
                  : new Date(booking.createdAt as Date);
              return (
                <RequestCard
                  key={booking.id}
                  id={booking.id}
                  customerName={booking.customerName}
                  barberName={booking.barber?.name ?? "—"}
                  timeLabel={formatTime12h(timeDate)}
                  bookingType={booking.type}
                  onPress={() =>
                    router.push({
                      pathname: "/d/booking-detail",
                      params: { id: booking.id },
                    })
                  }
                  onAccept={() =>
                    router.push({
                      pathname: "/d/booking-detail",
                      params: { id: booking.id, action: "accept" },
                    })
                  }
                  onDecline={() =>
                    router.push({
                      pathname: "/d/booking-detail",
                      params: { id: booking.id, action: "decline" },
                    })
                  }
                />
              );
            })}
          </ScrollView>
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          Bookings <Text style={styles.sectionCount}>({bookings.length})</Text>
        </Text>
        <TouchableOpacity
          ref={filterBtnRef}
          onPress={handleOpenFilterMenu}
          activeOpacity={0.8}
          style={styles.filterPill}
        >
          <Text style={styles.filterLabel}>
            {SCHEDULE_STATUS_OPTIONS.find((o) => o.value === statusFilter)
              ?.label ?? "All"}
          </Text>
          <Ionicons name="chevron-down" size={14} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {bookings.map((booking, i) => {
          const timeDate =
            booking.type === "appointment" && booking.scheduledAt
              ? new Date(booking.scheduledAt as Date)
              : new Date(booking.createdAt as Date);
          const timeLabel = formatTime12h(timeDate);
          return (
            <BookingCard
              key={booking.id}
              customerName={booking.customerName}
              barberName={booking.barber?.name ?? "—"}
              timeLabel={timeLabel}
              duration={formatDuration(booking.totalDuration)}
              status={mapApiStatusToBookingStatus(booking.status)}
              bookingType={booking.type}
              onPress={() => handleBookingPress(booking.id)}
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
        highlightDates={requestedDateSet}
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
    backgroundColor: Colors.bg.default,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.06)",
    elevation: 2,
  },
  iconBtnDark: {
    backgroundColor: Colors.brand.primary,
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
    color: Colors.text.primary,
  },
  sectionCount: {
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
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.05)",
    elevation: 1,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
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
    color: Colors.text.secondary,
  },
  scrollContentPadding: {
    paddingBottom: 200,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  requestsSection: {
    marginBottom: 20,
  },
  requestsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 10,
    marginTop: 8,
  },
  requestsScroll: {
    gap: 10,
    paddingRight: 4,
  },
});

const reqStyles = StyleSheet.create({
  card: {
    width: 190,
    backgroundColor: Colors.bg.surface,
    borderRadius: 16,
    padding: 14,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.bg.default,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.text.secondary,
  },
  customerName: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  barberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  barberName: {
    fontSize: 12,
    color: Colors.text.muted,
  },
  actions: {
    flexDirection: "row",
    gap: 6,
    marginTop: 4,
  },
  declineBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: "center",
  },
  declineText: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.text.muted,
  },
  acceptBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: Colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});
