import { BookingDetailCard } from "@/src/features/schedule/components/BookingDetailCard";
import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { OverflowMenu } from "@/src/components/OverflowMenu";
import { StickyCta } from "@/src/features/schedule/components/StickyCta";
import { useBookingById, useUpdateBookingStatus } from "@/src/features/schedule/hooks";
import {
  formatDateLabel,
  formatDuration,
  formatPrice,
  formatScheduledTime,
  mapApiStatusToDetailStatus,
} from "@/src/features/schedule/utils/booking-formatters";
import { useToast } from "@/src/lib/providers";
import { getErrorMessage } from "@/src/lib/utils/error-handler";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ModalType = "cancel" | "start" | "takeover" | null;

export function BookingDetailWaitingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();

  const { data: booking, isLoading } = useBookingById(id ?? "");
  const { mutate: updateStatus } = useUpdateBookingStatus();

  const [overflowVisible, setOverflowVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  const handleHandle = () => setModalType("start");

  const handleConfirmStart = () => {
    if (!id) return;
    setModalType(null);
    updateStatus({ id, status: "in_progress" }, {
      onSuccess: () => {
        toast.success("Booking started");
        router.push(`/booking-detail-in-progress?id=${id}` as any);
      },
      onError: (error) => {
        toast.error(getErrorMessage(error));
      },
    });
  };

  const handleConfirmCancel = () => {
    if (!id) return;
    setModalType(null);
    updateStatus({ id, status: "cancelled", cancelReason: "Cancelled by barber" }, {
      onSuccess: () => {
        toast.success("Booking cancelled");
        router.back();
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

  const totalOriginal = booking.services.reduce((acc, s) => acc + s.originalPrice, 0);
  const totalAmount = booking.services.reduce((acc, s) => acc + s.price, 0);
  const discount = totalOriginal - totalAmount;

  const paymentSummary = [
    { label: `Services (${booking.services.length})`, value: formatPrice(totalOriginal) },
    ...(discount > 0 ? [{ label: "Discount", value: `-${formatPrice(discount)}` }] : []),
  ];

  const isMismatchedBarber =
    booking.requestedBarber &&
    booking.handledByBarber &&
    booking.requestedBarber.memberId !== booking.handledByBarber.memberId;

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
          metaIcon="people"
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
          label={isMismatchedBarber ? "Take Over" : "Handle this"}
          onPress={isMismatchedBarber ? () => setModalType("takeover") : handleHandle}
        />

        {overflowVisible ? (
          <View style={styles.menuOverlay}>
            <OverflowMenu
              visible
              items={[
                {
                  label: "Cancel Book",
                  danger: true,
                  onPress: () => {
                    setOverflowVisible(false);
                    setModalType("cancel");
                  },
                },
              ]}
              onClose={() => setOverflowVisible(false)}
            />
          </View>
        ) : null}

        <ConfirmationModal
          visible={modalType === "start"}
          icon="cut"
          title="Start this booking?"
          description="This will mark the booking as In Progress. Please make sure you are ready to serve the customer before continuing."
          confirmLabel="Yes"
          cancelLabel="No, Not Yet"
          onConfirm={handleConfirmStart}
          onCancel={() => setModalType(null)}
        />

        <ConfirmationModal
          visible={modalType === "cancel"}
          icon="close-circle"
          title="Cancel this booking?"
          description="This action cannot be undone. The customer will be notified."
          confirmLabel="Yes, Cancel"
          cancelLabel="No"
          onConfirm={handleConfirmCancel}
          onCancel={() => setModalType(null)}
        />

        <ConfirmationModal
          visible={modalType === "takeover"}
          icon="warning"
          title="Take Over This Booking?"
          description="The preferred barber differs. Do you want to take over this booking?"
          confirmLabel="Yes, Take Over"
          cancelLabel="No"
          onConfirm={handleConfirmStart}
          onCancel={() => setModalType(null)}
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
