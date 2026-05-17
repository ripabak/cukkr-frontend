import { Colors } from '@/src/theme/colors';
import AppTheme from "@/src/app-theme";
import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { OverflowMenu } from "@/src/components/OverflowMenu";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { BookingDetailCard, BookingDetailStatus } from "@/src/features/schedule/components/BookingDetailCard";
import { DualActionFooter } from "@/src/features/schedule/components/DualActionFooter";
import {
  useBookingById,
  useAcceptBooking,
  useDeclineBooking,
} from "@/src/features/schedule/hooks";
import {
  mapApiStatusToDetailStatus,
  formatDuration,
  formatPrice,
} from "@/src/features/schedule/utils/booking-formatters";
import { formatDateLabel, formatTime12h } from "@/src/utils/date";
import { useToast } from "@/src/lib/providers";
import { getErrorMessage } from "@/src/lib/utils/error-handler";

export function BookingDetailRequestScreen() {
  const router = useRouter();
  const { id, action } = useLocalSearchParams<{ id: string; action?: string }>();
  const toast = useToast();

  const { data: booking, isLoading } = useBookingById(id ?? "");
  const { mutate: acceptBooking, isPending: isAccepting } = useAcceptBooking();
  const { mutate: declineBooking, isPending: isDeclining } = useDeclineBooking();

  const [overflowVisible, setOverflowVisible] = useState(false);
  const [localStatus, setLocalStatus] = useState<BookingDetailStatus | null>(null);
  const [acceptModalVisible, setAcceptModalVisible] = useState(false);
  const [declineModalVisible, setDeclineModalVisible] = useState(false);

  useEffect(() => {
    if (!isLoading && booking) {
      if (action === "accept") setAcceptModalVisible(true);
      else if (action === "decline") setDeclineModalVisible(true);
    }
  }, [action, isLoading, booking]);

  const displayStatus = localStatus ?? (booking ? mapApiStatusToDetailStatus(booking.status) : "requested");
  const isDecided = displayStatus === "declined" || displayStatus === "completed";

  const handleAccept = () => {
    if (!id) return;
    setAcceptModalVisible(false);
    acceptBooking(id, {
      onSuccess: () => {
        setLocalStatus("completed");
        toast.success("Booking accepted");
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleDecline = () => {
    if (!id) return;
    setDeclineModalVisible(false);
    declineBooking({ id, reason: "Declined by barber" }, {
      onSuccess: () => {
        setLocalStatus("declined");
        toast.success("Booking declined");
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
      : new Date(booking.createdAt as Date);
    const scheduledLabel = booking.scheduledAt
      ? `Scheduled at ${formatTime12h(timeDate)}`
      : `Arrived at ${formatTime12h(timeDate)}`;

    const infoRows = [
      { label: "Book No", value: `#${booking.referenceNumber}` },
      ...(booking.requestedBarber
        ? [{ label: "Requested", value: booking.requestedBarber.name, valueIconName: "cut" }]
        : []),
    ];

    const services = booking.services.map((s) => ({
      name: `${s.serviceName} (${s.duration}m)`,
      price: formatPrice(s.price),
    }));

    const totalAmount = booking.services.reduce((acc, s) => acc + s.price, 0);
    const totalOriginal = booking.services.reduce((acc, s) => acc + s.originalPrice, 0);
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
          status={displayStatus}
          infoRows={infoRows}
          services={services}
          notes={booking.notes ?? undefined}
          paymentSummary={paymentSummary}
          onWhatsApp={() => {}}
        />

        {!isDecided ? (
          <DualActionFooter
            onDecline={() => setDeclineModalVisible(true)}
            onAccept={() => setAcceptModalVisible(true)}
          />
        ) : null}
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
              items={[{ label: "Cancel Book", danger: true, onPress: () => setOverflowVisible(false) }]}
              onClose={() => setOverflowVisible(false)}
            />
          </View>
        ) : null}

        <ConfirmationModal
          visible={acceptModalVisible}
          icon="checkmark-circle-outline"
          title="Accept this booking?"
          description="The customer will be notified and the booking will be moved to the queue."
          confirmLabel={isAccepting ? "Accepting..." : "Accept"}
          cancelLabel="Cancel"
          onConfirm={handleAccept}
          onCancel={() => setAcceptModalVisible(false)}
        />

        <ConfirmationModal
          visible={declineModalVisible}
          icon="close-circle-outline"
          title="Decline this booking?"
          description="The booking will be cancelled and the customer will be notified."
          confirmLabel={isDeclining ? "Declining..." : "Decline"}
          cancelLabel="Cancel"
          onConfirm={handleDecline}
          onCancel={() => setDeclineModalVisible(false)}
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
