import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { OverflowMenu } from "@/src/components/OverflowMenu";
import { BookingDetailCard, BookingDetailStatus } from "@/src/components/BookingDetailCard";
import { DualActionFooter } from "@/src/components/DualActionFooter";
import {
  useBookingById,
  useAcceptBooking,
  useDeclineBooking,
} from "@/src/features/schedule/hooks";
import {
  mapApiStatusToDetailStatus,
  formatDateLabel,
  formatScheduledTime,
  formatDuration,
  formatPrice,
} from "@/src/features/schedule/utils/booking-formatters";
import { useToast } from "@/src/lib/providers";
import { getErrorMessage } from "@/src/lib/utils/error-handler";

export function BookingDetailRequestScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();

  const { data: booking, isLoading } = useBookingById(id ?? "");
  const { mutate: acceptBooking } = useAcceptBooking();
  const { mutate: declineBooking } = useDeclineBooking();

  const [overflowVisible, setOverflowVisible] = useState(false);
  const [localStatus, setLocalStatus] = useState<BookingDetailStatus | null>(null);

  const displayStatus = localStatus ?? (booking ? mapApiStatusToDetailStatus(booking.status) : "requested");
  const isDecided = displayStatus === "declined" || displayStatus === "completed";

  const handleAccept = () => {
    if (!id) return;
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

  if (isLoading || !booking) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centered}>
          {isLoading ? (
            <ActivityIndicator size="large" color="#1A1A1A" />
          ) : (
            <Text style={styles.errorText}>Booking not found.</Text>
          )}
        </View>
      </SafeAreaView>
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
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setOverflowVisible(true)}
            activeOpacity={0.7}
            style={styles.overflowBtn}
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <BookingDetailCard
          customerName={booking.customer.name}
          dateLabel={formatDateLabel(timeRef)}
          metaIcon="calendar"
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
            onDecline={handleDecline}
            onAccept={handleAccept}
          />
        ) : null}

        {overflowVisible ? (
          <View style={styles.menuOverlay}>
            <OverflowMenu
              visible
              items={[{ label: "Cancel Book", danger: true, onPress: () => setOverflowVisible(false) }]}
              onClose={() => setOverflowVisible(false)}
            />
          </View>
        ) : null}
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
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F0E8",
    alignItems: "center",
    justifyContent: "center",
  },
  overflowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
