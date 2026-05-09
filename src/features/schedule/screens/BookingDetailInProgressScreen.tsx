import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { BookingDetailCard } from "@/src/features/schedule/components/BookingDetailCard";
import { StickyCta } from "@/src/features/schedule/components/StickyCta";
import { OverflowMenu } from "@/src/components/OverflowMenu";
import { SwipeConfirmationModal } from "@/src/features/schedule/components/SwipeConfirmationModal";
import { useBookingById, useUpdateBookingStatus } from "@/src/features/schedule/hooks";
import {
  mapApiStatusToDetailStatus,
  formatDateLabel,
  formatScheduledTime,
  formatDuration,
  formatPrice,
} from "@/src/features/schedule/utils/booking-formatters";
import { useToast } from "@/src/lib/providers";
import { getErrorMessage } from "@/src/lib/utils/error-handler";

export function BookingDetailInProgressScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();

  const { data: booking, isLoading } = useBookingById(id ?? "");
  const { mutate: updateStatus } = useUpdateBookingStatus();

  const [overflowVisible, setOverflowVisible] = useState(false);
  const [swipeModalVisible, setSwipeModalVisible] = useState(false);

  const handleComplete = () => {
    if (!id) return;
    setSwipeModalVisible(false);
    updateStatus({ id, status: "completed" }, {
      onSuccess: () => {
        toast.success("Booking completed");
        router.push(`/booking-detail-result?id=${id}` as any);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleMarkWaiting = () => {
    if (!id) return;
    setOverflowVisible(false);
    updateStatus({ id, status: "waiting" }, {
      onSuccess: () => {
        toast.success("Booking set back to waiting");
        router.push(`/booking-detail-waiting?id=${id}` as any);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

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
      : `Started at ${formatScheduledTime(booking.startedAt ?? booking.createdAt)}`;

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
      <>
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

        <StickyCta
          label="Complete"
          onPress={() => setSwipeModalVisible(true)}
          color="#55C46B"
          textColor="#FFFFFF"
        />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        <ScreenHeader
          onBack={() => router.back()}
          rightAction={
            <TouchableOpacity
              onPress={isLoading ? undefined : () => setOverflowVisible(true)}
              activeOpacity={0.7}
              style={styles.overflowBtn}
            >
              <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          }
        />

        {renderContent()}

        {overflowVisible ? (
          <View style={styles.menuOverlay}>
            <OverflowMenu
              visible
              items={[
                {
                  label: "Mark as Waiting",
                  onPress: handleMarkWaiting,
                },
              ]}
              onClose={() => setOverflowVisible(false)}
            />
          </View>
        ) : null}

        <SwipeConfirmationModal
          visible={swipeModalVisible}
          title="Complete Booking?"
          description={
            "This action will finalize the booking and cannot be undone.\n\nPlease make sure the service and details are correct before continuing."
          }
          swipeLabel="Swipe to complete"
          onComplete={handleComplete}
          onCancel={() => setSwipeModalVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F4E8",
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
  overflowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
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
