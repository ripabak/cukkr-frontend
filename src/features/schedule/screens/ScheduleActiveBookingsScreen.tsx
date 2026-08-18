import { BookingCard } from "@/src/components/BookingCard";
import { ScreenShell } from "@/src/components/ScreenShell";
import { getScheduleStatusOptions } from "@/src/components/StatusFilterMenu";
import { FilterPicker } from "@/src/components/FilterPicker";

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
  useRequestedBookings,
} from "@/src/features/schedule/hooks";
import {
  formatDuration,
  mapApiStatusToBookingStatus,
  sortBookingsQueue,
} from "@/src/features/schedule/utils/booking-formatters";
import { formatTime12h, toApiDate } from "@/src/utils/date";
import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { AppText } from "@/src/components/AppText";
import {
  Animated,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
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
      style={[reqStyles.card, Neu.raised(Colors.bg.surface)]}
    >
      <View style={reqStyles.iconRow}>
        <View style={[reqStyles.iconCircle, Neu.inset(Colors.bg.surface, 0.6)]}>
          <Ionicons name={iconName as any} size={16} color={Colors.text.secondary} />
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
          activeOpacity={0.85}
          style={[reqStyles.declineBtn, Neu.soft(Colors.bg.surface)]}
        >
          <AppText style={reqStyles.declineText}>{t("bookings.actionDecline")}</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onAccept}
          activeOpacity={0.85}
          style={[reqStyles.acceptBtn, Neu.accent(0.9)]}
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
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "waiting" | "in_progress" | "completed" | "cancelled"
  >("all");
  const [newBookVisible, setNewBookVisible] = useState(false);
  const requestScrollRef = useRef<ScrollView>(null);

  // Collapsing sticky header (mirrors HomeDashboard).
  const headerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const isHeaderVisible = useRef(true);
  const [stickyHeaderHeight, setStickyHeaderHeight] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const diff = y - lastScrollY.current;
    if (diff > 10 && y > stickyHeaderHeight && isHeaderVisible.current) {
      isHeaderVisible.current = false;
      Animated.timing(headerTranslateY, {
        toValue: -stickyHeaderHeight,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if ((diff < -5 || y <= 0) && !isHeaderVisible.current) {
      isHeaderVisible.current = true;
      Animated.timing(headerTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
    lastScrollY.current = y;
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

  const { data: requestsData = [] } = useRequestedBookings(
    reqDateFrom,
    reqDateTo,
  );
  const requestCount = requestsData.length;
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

  const handleRequestsPress = () => {
    router.push({ pathname: "/d/booking-requests" });
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
      stickyHeader
      stickyHeaderHeight={stickyHeaderHeight}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      headerSlot={
        <Animated.View
          style={{
            transform: [{ translateY: headerTranslateY }],
            backgroundColor: Colors.bg.default,
          }}
          onLayout={(e) => setStickyHeaderHeight(e.nativeEvent.layout.height)}
        >
          <View style={styles.topBar}>
            <DateSelectorPill
              label={formatDatePill(selectedDate, language)}
              onPress={() => setCalendarVisible(true)}
            />
            <TouchableOpacity
              onPress={handleRequestsPress}
              activeOpacity={0.85}
              style={[styles.requestsBtn, Neu.soft(Colors.bg.surface)]}
            >
              <Ionicons
                name="list-outline"
                size={18}
                color={Colors.text.primary}
              />
              <AppText style={styles.requestsBtnLabel}>
                {t("schedule.requestsButton")}
              </AppText>
              {requestCount > 0 && (
                <View style={styles.requestsBadge}>
                  <AppText style={styles.requestsBadgeText}>
                    {requestCount > 99 ? "99+" : requestCount}
                  </AppText>
                </View>
              )}
            </TouchableOpacity>
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
        </Animated.View>
      }
      overlaySlot={
        <TouchableOpacity
          onPress={handleNewAppointment}
          activeOpacity={0.85}
          style={[styles.fab, Neu.accent(1.2)]}
        >
          <Ionicons name="add" size={28} color={Colors.text.primary} />
        </TouchableOpacity>
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
        <FilterPicker
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
          pillStyle={styles.filterPill}
          pillTextStyle={styles.filterLabel}
        />
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 12,
  },
  requestsBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  requestsBtnLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  requestsBadge: {
    backgroundColor: Colors.status.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  requestsBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
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
    position: "relative",
    zIndex: 999,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "600",
    color: Colors.text.primary,
    letterSpacing: -0.6,
  },
  sectionCount: {
    fontWeight: "500",
    color: Colors.text.muted,
  },
  filterPill: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
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
    fontWeight: "500",
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
  requestsSection: {
    marginBottom: 24,
  },
  requestsTitle: {
    fontSize: 17,
    fontWeight: "600",
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
    alignItems: "center",
    justifyContent: "center",
    zIndex: 40,
  },
});

const reqStyles = StyleSheet.create({
  card: {
    width: 200,
    borderRadius: 20,
    padding: 16,
    gap: 8,
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
    alignItems: "center",
    justifyContent: "center",
  },
  time: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.text.secondary,
  },
  customerName: {
    fontSize: 15,
    fontWeight: "600",
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
    alignItems: "center",
  },
  declineText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.status.danger,
  },
  acceptBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  acceptText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});
