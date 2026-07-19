import { BookingCard } from "@/src/components/BookingCard";
import { ScreenShell } from "@/src/components/ScreenShell";
import {
  getScheduleStatusOptions,
  StatusFilterMenu,
} from "@/src/components/StatusFilterMenu";
import { useHorizontalScrollDrag } from "@/src/hooks";
import { CalendarModal } from "@/src/features/schedule/components/CalendarModal";
import { DateSelectorPill } from "@/src/features/schedule/components/DateSelectorPill";
import { NewBookBottomSheet } from "@/src/components/NewBookBottomSheet";
import {
  DayChip,
  DayChipRow,
} from "@/src/features/schedule/components/DayChipRow";
import {
  useBookingDateMarkers,
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
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { AppText } from "@/src/components/AppText";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const NO_BOOKING_PLACEHOLDER = require("@/assets/images/no-booking-placeholder.png");

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
  const { t } = useI18nContext();
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
        <AppText style={reqStyles.time}>{timeLabel}</AppText>
      </View>
      <AppText style={reqStyles.customerName} numberOfLines={1}>
        {customerName}
      </AppText>
      <View style={reqStyles.barberRow}>
        <Ionicons name="cut" size={11} color={Colors.text.muted} />
        <AppText style={reqStyles.barberName} numberOfLines={1}>
          {" "}
          {barberName}
        </AppText>
      </View>
      <View style={reqStyles.actions}>
        <TouchableOpacity
          onPress={onDecline}
          activeOpacity={0.8}
          style={reqStyles.declineBtn}
        >
          <AppText style={reqStyles.declineText}>{t("bookings.actionDecline")}</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onAccept}
          activeOpacity={0.8}
          style={reqStyles.acceptBtn}
        >
          <AppText style={reqStyles.acceptText}>{t("bookings.actionAccept")}</AppText>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

function generateDayChips(baseDate: Date, language: string): DayChip[] {
  const locale = language === 'id' ? 'id-ID' : 'en-US';
  const dayLabels = Array.from({ length: 7 }, (_, i) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(new Date(2024, 0, i + 1))
  );
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

function formatDatePill(date: Date, language: string): string {
  const locale = language === 'id' ? 'id-ID' : 'en-US';
  const dayFormat = new Intl.DateTimeFormat(locale, { weekday: 'short' });
  const monthFormat = new Intl.DateTimeFormat(locale, { month: 'short' });
  const dayLabel = dayFormat.format(date);
  const monthLabel = monthFormat.format(date);
  return `${dayLabel}, ${date.getDate()} ${monthLabel} ${String(date.getFullYear()).slice(2)}`;
}

export function ScheduleActiveBookingsScreen() {
  const router = useRouter();
  const today = new Date();
  const { t, language } = useI18nContext();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedKey, setSelectedKey] = useState(toApiDate(today));
  const [filterMenuVisible, setFilterMenuVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "waiting" | "in_progress" | "completed" | "cancelled"
  >("all");
  const [newBookVisible, setNewBookVisible] = useState(false);
  const requestScrollRef = useHorizontalScrollDrag();
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

  const days = generateDayChips(today, language);

  const reqDateFrom = toApiDate(today);
  const reqDateTo = toApiDate(
    new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()),
  );
  const { data: markersData } = useBookingDateMarkers(reqDateFrom, reqDateTo);
  const { requestedDateSet, waitingDateSet } = React.useMemo(() => {
    const requested = new Set<string>();
    const waiting = new Set<string>();
    if (markersData?.markers) {
      for (const [dateKey, entry] of Object.entries(markersData.markers)) {
        if (entry.requested) requested.add(dateKey);
        if (entry.waiting) waiting.add(dateKey);
      }
    }
    return { requestedDateSet: requested, waitingDateSet: waiting };
  }, [markersData]);

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

  const handleNewAppointment = () => {
    setNewBookVisible(true);
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Image
        source={NO_BOOKING_PLACEHOLDER}
        style={styles.emptyImage}
        resizeMode="cover"
      />
      <AppText style={styles.emptyTitle}>{t("schedule.noBookings")}</AppText>
      <AppText style={styles.emptySubtitle}>
        {t("schedule.emptySubtitle")}
      </AppText>
    </View>
  );

  return (
    <ScreenShell
      backgroundColor={Colors.bg.default}
      contentStyle={styles.scrollContentPadding}
      hideAppHeader
      headerSlot={
        <>
          <View style={styles.topBar}>
            <DateSelectorPill
              label={formatDatePill(selectedDate, language)}
              onPress={() => setCalendarVisible(true)}
            />
          </View>
          <View style={styles.dayChipsWrapper}>
            <DayChipRow
              days={days}
              selectedKey={selectedKey}
              onSelect={handleSelectDay}
              onShowMore={() => setCalendarVisible(true)}
              highlightDates={requestedDateSet}
              waitingDates={waitingDateSet}
            />
          </View>
        </>
      }
      overlaySlot={
        <>
          {filterMenuVisible ? (
            <View style={styles.menuOverlay}>
              <StatusFilterMenu
                visible
                options={getScheduleStatusOptions(t)}
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
          ) : null}
          <TouchableOpacity
            onPress={handleNewAppointment}
            activeOpacity={0.85}
            style={styles.fab}
          >
            <Ionicons name="add" size={28} color={Colors.text.primary} />
          </TouchableOpacity>
        </>
      }
    >
      {requestedBookings.length > 0 && (
        <View style={styles.requestsSection}>
          <AppText style={styles.requestsTitle}>
            {t("bookings.appointmentRequest")}{" "}
            <AppText style={styles.sectionCount}>
              ({requestedBookings.length})
            </AppText>
          </AppText>
          <ScrollView
            ref={requestScrollRef}
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
        <AppText style={styles.sectionTitle}>
          {t("schedule.bookings")}{" "}
          <AppText style={styles.sectionCount}>({bookings.length})</AppText>
        </AppText>
        <TouchableOpacity
          ref={filterBtnRef}
          onPress={handleOpenFilterMenu}
          activeOpacity={0.8}
          style={styles.filterPill}
        >
          <AppText style={styles.filterLabel}>
            {getScheduleStatusOptions(t).find((o) => o.value === statusFilter)
              ?.label ?? t("common.all")}
          </AppText>
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
        {!isLoading && bookings.length === 0 ? renderEmptyState() : null}
      </View>

      <CalendarModal
        visible={calendarVisible}
        selectedDate={selectedDate}
        disablePast={false}
        highlightDates={requestedDateSet}
        waitingDates={waitingDateSet}
        onSelect={handleCalendarSelect}
        onClose={() => setCalendarVisible(false)}
      />
      <NewBookBottomSheet
        visible={newBookVisible}
        onClose={() => setNewBookVisible(false)}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 12,
  },
  dayChipsWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text.primary,
    letterSpacing: -0.8,
  },
  sectionCount: {
    fontWeight: "500",
    color: Colors.text.muted,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bg.default,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: Colors.border.light,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    elevation: 2,
  },
  filterLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  list: {
    gap: 0,
  },
  cardMargin: {
    marginBottom: 16,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 220,
    height: 220,
    borderRadius: 110,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.text.primary,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
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
    marginBottom: 24,
  },
  requestsTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  requestsScroll: {
    gap: 12,
    paddingRight: 4,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 6px 20px rgba(255, 200, 30, 0.45)",
    elevation: 6,
    zIndex: 40,
  },
});

const reqStyles = StyleSheet.create({
  card: {
    width: 200,
    backgroundColor: Colors.bg.default,
    borderRadius: 20,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    elevation: 2,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.bg.cream,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  customerName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  barberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  barberName: {
    fontSize: 13,
    color: Colors.text.muted,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 6,
  },
  declineBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: "center",
  },
  declineText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.muted,
  },
  acceptBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});
