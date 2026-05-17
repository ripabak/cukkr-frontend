import { Colors } from '@/src/theme/colors';
import AppTheme from "@/src/app-theme";
import React from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { BookingDetailCard } from "@/src/features/schedule/components/BookingDetailCard";
import { useBookingById } from "@/src/features/schedule/hooks";
import {
  mapApiStatusToDetailStatus,
  formatDuration,
  formatPrice,
} from "@/src/features/schedule/utils/booking-formatters";
import { formatDateLabel, formatTime12h } from "@/src/utils/date";

export function BookingDetailResultScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: booking, isLoading } = useBookingById(id ?? "");

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.text.primary} />
        </View>
      );
    }

    if (!booking) {
      return (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Booking not found.</Text>
        </View>
      );
    }

    const totalDuration = booking.services.reduce((acc, s) => acc + s.duration, 0);
    const timeDate = booking.scheduledAt
      ? new Date(booking.scheduledAt as Date)
      : new Date(booking.createdAt as Date);
    const scheduledLabel = booking.scheduledAt
      ? `Scheduled at ${formatTime12h(timeDate)}`
      : `Arrived at ${formatTime12h(timeDate)}`;

    const infoRows = [
      { label: "Book No", value: `#${booking.referenceNumber}` },
      ...(booking.requestedBarber
        ? [{ label: "Requested", value: booking.requestedBarber.name, valueIconName: "cut" }]
        : []),
      ...(booking.handledByBarber
        ? [{ label: "Handled By", value: booking.handledByBarber.name, valueIconName: "cut" }]
        : []),
    ];

    const services = booking.services.map((s) => ({
      name: `${s.serviceName} (${s.duration}m)`,
      price: formatPrice(s.price),
    }));

    const totalOriginal = booking.services.reduce((acc, s) => acc + s.originalPrice, 0);
    const totalAmount = booking.services.reduce((acc, s) => acc + s.price, 0);
    const discount = totalOriginal - totalAmount;

    const paymentSummary = [
      { label: `Services (${booking.services.length})`, value: formatPrice(totalOriginal) },
      ...(discount > 0 ? [{ label: "Discount", value: `-${formatPrice(discount)}` }] : []),
    ];

    return (
      <BookingDetailCard
        customerName={booking.customer.name}
        dateLabel={formatDateLabel(timeDate)}
        bookingType={booking.type}
        metaLine1={scheduledLabel}
        metaLine2={`Duration ${formatDuration(totalDuration)}`}
        status={mapApiStatusToDetailStatus(booking.status)}
        infoRows={infoRows}
        services={services}
        notes={booking.notes ?? undefined}
        paymentSummary={paymentSummary}
        onWhatsApp={() => {}}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        <ScreenHeader onBack={() => router.back()} />
        {renderContent()}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg.default,
    paddingTop: AppTheme.spacing.lg,
  },
  outer: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});
