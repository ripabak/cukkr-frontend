import { ConfirmationModal } from '@/src/components/ConfirmationModal';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { ScreenShell } from '@/src/components/ScreenShell';
import { NotificationCard, NotificationType } from '@/src/features/notifications/components/NotificationCard';
import { Colors } from '@/src/theme/colors';
import { formatRelativeTime } from '@/src/utils/date';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAcceptNotification, useDeclineNotification, useMarkAllAsRead } from '../hooks/useNotificationsMutations';
import { useNotificationsList } from '../hooks/useNotificationsQueries';

const API_TYPE_MAP: Record<string, NotificationType> = {
  appointment_requested: 'appointment-request',
  walk_in_arrival: 'walk-in',
  barbershop_invitation: 'invitation',
};
type NotifItem = NonNullable<ReturnType<typeof useNotificationsList>['data']>['data'][number];

export function NotificationsListScreen() {
  const router = useRouter();
  const { data, isLoading, isError } = useNotificationsList();
  const acceptMutation = useAcceptNotification();
  const declineMutation = useDeclineNotification();
  const markAllRead = useMarkAllAsRead();

  const [invitationModal, setInvitationModal] = useState<NotifItem | null>(null);

  const notifications = data?.data ?? [];

  const handleBookingPress = (notif: NotifItem) => {
    if (!notif.referenceId) return;
    const route = notif.type === 'walk_in_arrival' ? '/booking-detail-waiting' : '/booking-detail-request';
    router.push({ pathname: route, params: { id: notif.referenceId } });
  };

  const handleAcceptInvitation = () => {
    if (!invitationModal) return;
    acceptMutation.mutate(invitationModal.id, { onSuccess: () => setInvitationModal(null) });
  };

  const handleDeclineInvitation = () => {
    if (!invitationModal) return;
    declineMutation.mutate({ id: invitationModal.id }, { onSuccess: () => setInvitationModal(null) });
  };

  return (
    <ScreenShell
      headerSlot={
        <ScreenHeader
          onBack={() => router.back()}
          rightAction={
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.moreBtn}
              onPress={() => markAllRead.mutate()}
            >
              <Ionicons name="checkmark-done" size={20} color={Colors.text.primary} />
            </TouchableOpacity>
          }
        />
      }
      contentStyle={styles.content}
    >
      {!isLoading && isError ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>Failed to load notifications</Text>
        </View>
      ) : null}

      {!isLoading && !isError && notifications.length === 0 ? (
        <View style={styles.centered}>
          <Ionicons name="notifications-off-outline" size={48} color={Colors.icon.muted} />
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptySubtitle}>You're all caught up!</Text>
        </View>
      ) : null}

      {!isLoading && !isError && notifications.length > 0 ? (
        <View style={styles.list}>
          {notifications.map((notif, i) => (
            <NotificationCard
              key={notif.id}
              type={API_TYPE_MAP[notif.type] ?? 'general'}
              title={notif.title}
              name={notif.body}
              timestamp={formatRelativeTime(notif.createdAt)}
              status={notif.actionType !== null ? 'pending' : 'accepted'}
              showActions={notif.actionType === 'accept_decline_appointment'}
              onAccept={() => acceptMutation.mutate(notif.id)}
              onDecline={() => declineMutation.mutate({ id: notif.id })}
              onPress={
                notif.referenceType === 'booking'
                  ? () => handleBookingPress(notif)
                  : notif.referenceType === 'invitation'
                  ? () => setInvitationModal(notif)
                  : undefined
              }
              style={i < notifications.length - 1 ? styles.cardMargin : undefined}
            />
          ))}
        </View>
      ) : null}

      <ConfirmationModal
        visible={invitationModal !== null}
        icon="person-add"
        title={invitationModal?.title ?? ''}
        description={invitationModal?.body}
        cancelLabel="Accept"
        confirmLabel="Decline"
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
  moreBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.brand.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: 12,
  },
  cardMargin: {
    marginBottom: 0,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 8,
  },
  errorText: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.text.muted,
  },
});
