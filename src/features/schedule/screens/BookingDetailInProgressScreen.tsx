import { Colors } from '@/src/theme/colors';
import AppTheme from "@/src/app-theme";
import { OverflowMenu } from "@/src/components/OverflowMenu";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { BookingDetailCard } from "@/src/features/schedule/components/BookingDetailCard";
import { StickyCta } from "@/src/features/schedule/components/StickyCta";
import { SwipeConfirmationModal } from "@/src/features/schedule/components/SwipeConfirmationModal";
import { useBookingById, useUpdateBookingStatus } from "@/src/features/schedule/hooks";
import {
  formatDuration,
  formatPrice,
  mapApiStatusToDetailStatus,
} from "@/src/features/schedule/utils/booking-formatters";
import { formatDateLabel, formatTime12h } from "@/src/utils/date";
import { useToast } from "@/src/lib/providers";
import { getErrorMessage } from "@/src/lib/utils/error-handler";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
        router.replace(`/booking-detail-result?id=${id}`);
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
        router.replace(`/booking-detail-waiting?id=${id}`);
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
      : new Date((booking.startedAt ?? booking.createdAt) as Date);
    const scheduledLabel = booking.scheduledAt
      ? `Scheduled at ${formatTime12h(timeDate)}`
      : `Started at ${formatTime12h(timeDate)}`;

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
      <>
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

        <StickyCta
          label="Complete"
          onPress={() => setSwipeModalVisible(true)}
          color={Colors.status.success}
          textColor={Colors.text.primary}
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
              <Ionicons name="ellipsis-horizontal" size={20} color={Colors.text.primary} />
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
  overflowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.brand.primary,
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
