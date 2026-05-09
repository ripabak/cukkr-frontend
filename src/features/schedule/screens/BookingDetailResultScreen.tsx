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
  formatDateLabel,
  formatScheduledTime,
  formatDuration,
  formatPrice,
} from "@/src/features/schedule/utils/booking-formatters";

export function BookingDetailResultScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: booking, isLoading } = useBookingById(id ?? "");

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1A1A1A" />
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
    const timeRef = booking.scheduledAt ?? booking.createdAt;
    const scheduledLabel = booking.scheduledAt
      ? `Scheduled at ${formatScheduledTime(booking.scheduledAt)}`
      : `Arrived at ${formatScheduledTime(booking.createdAt)}`;

    const infoRows = [
      { label: "Book No", value: `#${booking.referenceNumber}` },
      ...(booking.requestedBarber
        ? [{ label: "Requested", value: `⚙ ${booking.requestedBarber.name}` }]
        : []),
      ...(booking.handledByBarber
        ? [{ label: "Handled By", value: `⚙ ${booking.handledByBarber.name}` }]
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
        dateLabel={formatDateLabel(timeRef)}
        metaIcon="calendar"
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
    backgroundColor: "#F5F4E8",
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
    color: "#666666",
  },
});
