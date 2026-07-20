import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { CrossOrgNotificationModal } from "@/src/components/CrossOrgNotificationModal";
import { OverflowMenu } from "@/src/components/OverflowMenu";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { BookingDetailCard } from "@/src/features/schedule/components/BookingDetailCard";
import { DualActionFooter } from "@/src/features/schedule/components/DualActionFooter";
import { StickyCta } from "@/src/features/schedule/components/StickyCta";
import { SwipeConfirmationModal } from "@/src/features/schedule/components/SwipeConfirmationModal";
import { DeclineReasonModal } from "@/src/features/schedule/components/DeclineReasonModal";
import {
  useAcceptBooking,
  useBookingById,
  useDeclineBooking,
  useUpdateBookingStatus,
} from "@/src/features/schedule/hooks";
import {
  formatDuration,
  formatPrice,
  mapApiStatusToDetailStatus,
} from "@/src/features/schedule/utils/booking-formatters";
import { getErrorMessage } from "@/src/lib/utils/error-handler";
import { useToast } from "@/src/lib/providers";
import { Colors } from "@/src/theme/colors";
import { formatDateLabel, formatTime12h } from "@/src/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { AppText } from "@/src/components/AppText";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { authClient } from "@/src/lib/auth-client";
import { organizationService } from "@/src/features/workspace/services/organization.service";
import { WORKSPACE_SCOPED_KEYS } from "@/src/features/workspace/hooks/useOrganizationMutations";
import { useQueryClient } from "@tanstack/react-query";

type ModalType = "accept" | "decline" | "start" | "takeover" | "cancel" | null;

export function BookingDetailScreen() {
  const router = useRouter();
  const { t } = useI18nContext();
  const { id, action, orgId, orgName } = useLocalSearchParams<{
    id: string;
    action?: string;
    orgId?: string;
    orgName?: string;
  }>();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [orgReady, setOrgReady] = useState(!orgId);
  const [showSwitchModal, setShowSwitchModal] = useState(false);

  useEffect(() => {
    if (!orgId) return;

    const session = authClient.getSession();
    session.then(({ data }) => {
      if (data?.session?.activeOrganizationId === orgId) {
        setOrgReady(true);
        return;
      }
      setShowSwitchModal(true);
    });
  }, [orgId]);

  const handleSwitchOrg = () => {
    if (!orgId) return;
    setShowSwitchModal(false);
    organizationService
      .setActive(orgId)
      .then(() => authClient.getSession())
      .then(() => {
        WORKSPACE_SCOPED_KEYS.forEach((key) => {
          queryClient.resetQueries({ queryKey: key });
        });
        setOrgReady(true);
      })
      .catch(() => {
        toast.error(
          "Unable to switch barbershop. You may no longer be a member.",
        );
        setOrgReady(true);
      });
  };

  const handleDismissSwitch = () => {
    setShowSwitchModal(false);
    setOrgReady(true);
  };

  const { data: booking, isLoading } = useBookingById(
    orgReady ? (id ?? "") : "",
  );
  const { mutate: acceptBooking, isPending: isAccepting } = useAcceptBooking();
  const { mutate: declineBooking, isPending: isDeclining } =
    useDeclineBooking();
  const { mutate: updateStatus } = useUpdateBookingStatus();

  const { data: activeMember } = authClient.useActiveMember();
  const role = (activeMember?.role as "owner" | "admin" | "member" | undefined) ?? null;

  const [overflowVisible, setOverflowVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);
  const [swipeModalVisible, setSwipeModalVisible] = useState(false);
  const actionModalShown = useRef(false);

  useEffect(() => {
    if (
      !isLoading &&
      booking &&
      booking.status === "requested" &&
      !actionModalShown.current
    ) {
      actionModalShown.current = true;
      if (action === "accept") setModalType("accept");
      else if (action === "decline") setModalType("decline");
    }
  }, [action, isLoading, booking]);

  const handleAccept = () => {
    if (!id) return;
    setModalType(null);
    acceptBooking(id, {
      onSuccess: () => toast.success(t("toast.bookingAccepted")),
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  const handleDecline = (reason?: string) => {
    if (!id) return;
    setModalType(null);
    declineBooking(
      { id, reason },
      {
        onSuccess: () => toast.success(t("toast.bookingDeclined")),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  const handleStart = () => {
    if (!id) return;
    setModalType(null);
    updateStatus(
      { id, status: "in_progress" },
      {
        onSuccess: () => toast.success(t("toast.bookingStarted")),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  const handleComplete = () => {
    if (!id) return;
    setSwipeModalVisible(false);
    updateStatus(
      { id, status: "completed" },
      {
        onSuccess: () => toast.success(t("toast.bookingCompleted")),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  const handleMarkWaiting = () => {
    if (!id) return;
    setOverflowVisible(false);
    updateStatus(
      { id, status: "waiting" },
      {
        onSuccess: () => toast.success(t("bookings.setBackToWaiting")),
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  const handleCancel = () => {
    if (!id) return;
    setModalType(null);
    updateStatus(
      { id, status: "cancelled", cancelReason: t("bookings.cancelReasonBarber") },
      {
        onSuccess: () => {
          toast.success(t("toast.bookingCancelled"));
          router.back();
        },
        onError: (error) => toast.error(getErrorMessage(error)),
      },
    );
  };

  const overflowItems = (() => {
    if (booking?.status === "waiting") {
      return [
        {
          label: t("bookings.actionCancel"),
          danger: true,
          onPress: () => {
            setOverflowVisible(false);
            setModalType("cancel");
          },
        },
      ];
    }
    if (booking?.status === "in_progress") {
      const items: { label: string; onPress?: () => void }[] = [];
      if (role === "owner" || role === "admin") {
        items.push({
          label: t("bookings.markAsCompleted"),
          onPress: () => {
            setOverflowVisible(false);
            setSwipeModalVisible(true);
          },
        });
      }
      items.push({ label: t("bookings.markAsWaiting"), onPress: handleMarkWaiting });
      return items;
    }
    return [];
  })();

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
          <AppText style={styles.errorText}>{t("bookings.bookingNotFound")}</AppText>
        </View>
      );
    }

    const totalDuration = booking.services.reduce(
      (acc, s) => acc + s.duration,
      0,
    );

    const timeDate =
      booking.status === "in_progress" && !booking.scheduledAt
        ? new Date((booking.startedAt ?? booking.createdAt) as Date)
        : booking.scheduledAt
          ? new Date(booking.scheduledAt as Date)
          : new Date(booking.createdAt as Date);

    const scheduledLabel = booking.scheduledAt
      ? t("bookings.scheduledAt", { time: formatTime12h(timeDate) })
      : booking.status === "in_progress"
        ? t("bookings.startedAt", { time: formatTime12h(timeDate) })
        : t("bookings.arrivedAt", { time: formatTime12h(timeDate) });

    const showHandledBy =
      booking.status === "in_progress" ||
      booking.status === "completed" ||
      booking.status === "cancelled";

    const isMismatchedBarber =
      booking.requestedBarber &&
      booking.handledByBarber &&
      booking.requestedBarber.memberId !== booking.handledByBarber.memberId;

    const infoRows = [
      { label: t("bookings.bookNo"), value: `#${booking.referenceNumber}` },
      ...(booking.requestedBarber
        ? [
            {
              label: t("bookings.requested"),
              value: booking.requestedBarber.name,
              valueIconName: "cut",
            },
          ]
        : []),
      ...(showHandledBy && booking.handledByBarber
        ? [
            {
              label: t("bookings.handledBy"),
              value: booking.handledByBarber.name,
              valueIconName: "cut",
            },
          ]
        : []),
      {
        label: t("bookings.source"),
        value:
          booking.source === "customer"
            ? t("bookings.customer")
            : booking.createdByName
              ? t("bookings.staffBy", { name: booking.createdByName })
              : t("bookings.staff"),
      },
    ];

    const services = booking.services.map((s) => ({
      name: `${s.serviceName} (${s.duration}m)`,
      price: formatPrice(s.price),
    }));

    const totalOriginal = booking.services.reduce(
      (acc, s) => acc + s.originalPrice,
      0,
    );
    const totalAmount = booking.services.reduce((acc, s) => acc + s.price, 0);
    const discount = totalOriginal - totalAmount;

    const paymentSummary = [
      {
        label: `${t("bookings.services")} (${booking.services.length})`,
        value: formatPrice(totalOriginal),
      },
      ...(discount > 0
        ? [{ label: t("bookings.discount"), value: `-${formatPrice(discount)}` }]
        : []),
    ];

    const footer = (() => {
      if (booking.status === "requested") {
        return (
          <DualActionFooter
            onDecline={() => setModalType("decline")}
            onAccept={() => setModalType("accept")}
          />
        );
      }
      if (booking.status === "waiting") {
        return (
          <StickyCta
            label={isMismatchedBarber ? t("bookings.takeOver") : t("bookings.handleThis")}
            onPress={() =>
              setModalType(isMismatchedBarber ? "takeover" : "start")
            }
          />
        );
      }
      if (booking.status === "in_progress") {
        if (role === "member") {
          const isHandlingBarber =
            booking.handledByBarber &&
            activeMember?.id === booking.handledByBarber.memberId;
          if (isHandlingBarber) {
            return (
              <StickyCta
                label={t("bookings.complete")}
                onPress={() => setSwipeModalVisible(true)}
                color={Colors.status.success}
                textColor={Colors.text.primary}
              />
            );
          }
        }
        return null;
      }
      return null;
    })();

    return (
      <>
        <BookingDetailCard
          customerName={booking.customer.name}
          dateLabel={formatDateLabel(timeDate)}
          bookingType={booking.type}
          metaLine1={scheduledLabel}
          metaLine2={t("bookings.duration", { duration: formatDuration(totalDuration) })}
          status={mapApiStatusToDetailStatus(booking.status)}
          infoRows={infoRows}
          services={services}
          notes={booking.notes ?? undefined}
          paymentSummary={paymentSummary}
          onCustomerPress={() =>
            router.push({
              pathname: "/d/customer-detail-general",
              params: { customerId: booking.customer.id },
            })
          }
        />
        {footer}
      </>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        <ScreenHeader
          onBack={() => router.back()}
          rightAction={
            overflowItems.length > 0 ? (
              <TouchableOpacity
                onPress={isLoading ? undefined : () => setOverflowVisible(true)}
                activeOpacity={0.7}
                style={styles.overflowBtn}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={20}
                  color={Colors.text.primary}
                />
              </TouchableOpacity>
            ) : undefined
          }
        />

        {renderContent()}

        {overflowVisible ? (
          <View style={styles.menuOverlay}>
            <OverflowMenu
              visible
              items={overflowItems}
              onClose={() => setOverflowVisible(false)}
            />
          </View>
        ) : null}

        <ConfirmationModal
          visible={modalType === "accept"}
          icon="checkmark-circle-outline"
          title={t("bookings.confirmAccept")}
          description={t("bookings.acceptDesc")}
          confirmLabel={isAccepting ? t("bookings.accepting") : t("bookings.actionAccept")}
          cancelLabel={t("common.cancel")}
          onConfirm={handleAccept}
          onCancel={() => setModalType(null)}
        />
        <DeclineReasonModal
          visible={modalType === "decline"}
          onSend={handleDecline}
          onCancel={() => setModalType(null)}
          isSending={isDeclining}
        />
        <ConfirmationModal
          visible={modalType === "start"}
          icon="cut"
          title={t("bookings.confirmStart")}
          description={t("bookings.startDesc")}
          confirmLabel={t("common.yes")}
          cancelLabel={t("bookings.noNotYet")}
          onConfirm={handleStart}
          onCancel={() => setModalType(null)}
        />
        <ConfirmationModal
          visible={modalType === "takeover"}
          icon="warning"
          title={t("bookings.takeOverTitle")}
          description={t("bookings.takeOverDesc")}
          confirmLabel={t("bookings.takeOverConfirm")}
          cancelLabel={t("common.no")}
          onConfirm={handleStart}
          onCancel={() => setModalType(null)}
        />
        <ConfirmationModal
          visible={modalType === "cancel"}
          icon="close-circle"
          title={t("bookings.confirmCancel")}
          description={t("bookings.cancelDesc")}
          confirmLabel={t("bookings.cancelConfirm")}
          cancelLabel={t("common.no")}
          onConfirm={handleCancel}
          onCancel={() => setModalType(null)}
        />
        <SwipeConfirmationModal
          visible={swipeModalVisible}
          title={t("bookings.completeTitle")}
          description={t("bookings.completeDesc")}
          swipeLabel={t("bookings.swipeToComplete")}
          onComplete={handleComplete}
          onCancel={() => setSwipeModalVisible(false)}
        />
        <CrossOrgNotificationModal
          visible={showSwitchModal}
          organizationName={
            typeof orgName === "string" ? orgName : "another barbershop"
          }
          onSwitch={handleSwitchOrg}
          onDismiss={handleDismissSwitch}
        />
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
