import { ScreenHeader } from "@/src/components/ScreenHeader";
import { BookingCard } from "@/src/components/BookingCard";
import { useRequestedBookings } from "@/src/features/schedule/hooks";
import {
  formatDateLabel,
  formatTime12h,
  toApiDate,
} from "@/src/utils/date";
import { Colors } from "@/src/theme/colors";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { AppText } from "@/src/components/AppText";
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  formatDuration,
  mapApiStatusToBookingStatus,
} from "@/src/features/schedule/utils/booking-formatters";

const NO_BOOKING_PLACEHOLDER = require("@/assets/images/no-booking-placeholder.png");

export function BookingRequestsScreen() {
  const router = useRouter();
  const { t } = useI18nContext();
  const today = new Date();

  const dateFrom = toApiDate(today);
  const dateTo = toApiDate(
    new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()),
  );

  const { data: bookings = [], isLoading } = useRequestedBookings(
    dateFrom,
    dateTo,
  );

  const grouped = useMemo(() => {
    const groups: Record<string, typeof bookings> = {};
    for (const booking of bookings) {
      const dateKey =
        booking.scheduledAt instanceof Date
          ? toApiDate(booking.scheduledAt)
          : booking.scheduledAt
            ? toApiDate(new Date(booking.scheduledAt as unknown as string))
            : toApiDate(new Date(booking.createdAt as Date));
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(booking);
    }
    const sortedKeys = Object.keys(groups).sort();
    return sortedKeys.map((key) => ({
      dateKey: key,
      label: formatDateLabel(new Date(key + "T00:00:00")),
      items: groups[key],
    }));
  }, [bookings]);

  const handleBookingPress = (bookingId: string) => {
    router.push({ pathname: "/d/booking-detail", params: { id: bookingId } });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Image
        source={NO_BOOKING_PLACEHOLDER}
        style={styles.emptyImage}
        resizeMode="cover"
      />
      <AppText style={styles.emptyTitle}>{t("bookings.noRequests")}</AppText>
      <AppText style={styles.emptySubtitle}>
        {t("bookings.noRequested")}
      </AppText>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        <ScreenHeader
          onBack={() => router.back()}
          title={t("bookings.requestsTitle")}
        />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? null : grouped.length === 0 ? (
            renderEmptyState()
          ) : (
            grouped.map((group) => (
              <View key={group.dateKey} style={styles.dateGroup}>
                <AppText style={styles.dateHeader}>{group.label}</AppText>
                {group.items.map((item, i) => {
                  const timeDate =
                    item.scheduledAt instanceof Date
                      ? item.scheduledAt
                      : item.scheduledAt
                        ? new Date(item.scheduledAt as string)
                        : new Date(item.createdAt as Date);
                  return (
                    <BookingCard
                      key={item.id}
                      customerName={item.customerName}
                      barberName={item.barber?.name ?? "—"}
                      timeLabel={formatTime12h(timeDate)}
                      duration={formatDuration(item.totalDuration)}
                      status={mapApiStatusToBookingStatus(item.status)}
                      bookingType={item.type}
                      onPress={() => handleBookingPress(item.id)}
                      style={i < group.items.length - 1 ? styles.cardMargin : undefined}
                    />
                  );
                })}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg.default,
  },
  outer: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    marginTop: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  dateGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 12,
  },
  cardMargin: {
    marginBottom: 14,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
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
});
