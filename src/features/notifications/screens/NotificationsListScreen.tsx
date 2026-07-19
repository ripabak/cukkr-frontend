import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import {
  NotificationCard,
  NotificationType,
} from "@/src/features/notifications/components/NotificationCard";
import { pwaNotificationService } from "@/src/services/pwa-notification.service";
import { Colors } from "@/src/theme/colors";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { formatRelativeTime } from "@/src/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import {
  useAcceptNotification,
  useDeclineNotification,
  useMarkAllAsRead,
} from "../hooks/useNotificationsMutations";
import { useNotificationsList } from "../hooks/useNotificationsQueries";

const API_TYPE_MAP: Record<string, NotificationType> = {
  appointment_requested: "appointment-request",
  walk_in_arrival: "walk-in",
  barbershop_invitation: "invitation",
};
type NotifItem = NonNullable<
  ReturnType<typeof useNotificationsList>["data"]
>["data"][number];

export function NotificationsListScreen() {
  const router = useRouter();
  const { t } = useI18nContext();
  const { data, isLoading, isError } = useNotificationsList();
  const acceptMutation = useAcceptNotification();
  const declineMutation = useDeclineNotification();
  const markAllRead = useMarkAllAsRead();

  const [invitationModal, setInvitationModal] = useState<NotifItem | null>(
    null,
  );

  const notifications = data?.data ?? [];

  useEffect(() => {
    markAllRead.mutate(undefined, {
      onSuccess: () => {
        pwaNotificationService.clearBadge();
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBookingPress = (notif: NotifItem) => {
    if (!notif.referenceId) return;
    router.push({
      pathname: "/d/booking-detail",
      params: { id: notif.referenceId },
    });
  };

  const handleAcceptInvitation = () => {
    if (!invitationModal) return;
    acceptMutation.mutate(invitationModal.id, {
      onSuccess: () => setInvitationModal(null),
    });
  };

  const handleDeclineInvitation = () => {
    if (!invitationModal) return;
    declineMutation.mutate(
      { id: invitationModal.id },
      { onSuccess: () => setInvitationModal(null) },
    );
  };

  return (
    <ScreenShell
      hideAppHeader
      headerSlot={<ScreenHeader onBack={() => router.back()} />}
      contentStyle={styles.content}
    >
      {!isLoading && isError ? (
        <View style={styles.centered}>
          <AppText style={styles.errorText}>{t("common.loadFailed")}</AppText>
        </View>
      ) : null}

      {!isLoading && !isError && notifications.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons
            name="notifications-off-outline"
            size={48}
            color={Colors.icon.muted}
          />
          <AppText style={styles.emptyTitle}>{t("notifications.empty")}</AppText>
          <AppText style={styles.emptySubtitle}>{t("components.emptyState.defaultMessage")}</AppText>
        </View>
      ) : null}

      {!isLoading && !isError && notifications.length > 0 ? (
        <View style={styles.list}>
          {notifications.map((notif, i) => (
            <NotificationCard
              key={notif.id}
              type={API_TYPE_MAP[notif.type] ?? "general"}
              title={notif.title}
              name={notif.body}
              organizationName={notif.organizationName}
              timestamp={formatRelativeTime(notif.createdAt)}
              status={
                notif.actionedAs === "accepted"
                  ? "accepted"
                  : notif.actionedAs === "declined"
                    ? "declined"
                    : "pending"
              }
              showActions={
                notif.actionType === "accept_decline_appointment" &&
                notif.actionedAs === null
              }
              isClickable={
                notif.referenceType === "booking" && !!notif.referenceId
              }
              onAccept={() =>
                router.push({
                  pathname: "/d/booking-detail",
                  params: { id: notif.referenceId!, action: "accept" },
                })
              }
              onDecline={() =>
                router.push({
                  pathname: "/d/booking-detail",
                  params: { id: notif.referenceId!, action: "decline" },
                })
              }
              onPress={
                notif.referenceType === "booking" && notif.referenceId
                  ? () => handleBookingPress(notif)
                  : notif.referenceType === "invitation"
                    ? () => setInvitationModal(notif)
                    : undefined
              }
              style={
                i < notifications.length - 1 ? styles.cardMargin : undefined
              }
            />
          ))}
        </View>
      ) : null}

      <ConfirmationModal
        visible={invitationModal !== null}
        icon="person-add"
        title={invitationModal?.title ?? ""}
        description={invitationModal?.body}
        cancelLabel={t("bookings.actionAccept")}
        confirmLabel={t("bookings.actionDecline")}
        onCancel={handleAcceptInvitation}
        onConfirm={handleDeclineInvitation}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingTop: 8,
    paddingBottom: 40,
  },
  list: {
    gap: 12,
  },
  cardMargin: {
    marginBottom: 0,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 8,
  },
  errorText: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.text.muted,
  },
});
