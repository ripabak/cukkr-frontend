import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NotificationCard, NotificationType } from '@/src/components/NotificationCard';
import { useNotificationsList } from '../hooks/useNotificationsQueries';
import { useAcceptNotification, useDeclineNotification, useMarkAllAsRead } from '../hooks/useNotificationsMutations';

const API_TYPE_MAP: Record<string, NotificationType> = {
  appointment_requested: 'appointment-request',
  walk_in_arrival: 'walk-in',
  barbershop_invitation: 'invitation',
};

function formatRelativeTime(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

export function NotificationsListScreen() {
  const router = useRouter();
  const { data, isLoading, isError } = useNotificationsList();
  const acceptMutation = useAcceptNotification();
  const declineMutation = useDeclineNotification();
  const markAllRead = useMarkAllAsRead();

  const notifications = data?.data ?? [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.moreBtn}
            onPress={() => markAllRead.mutate()}
          >
            <Ionicons name="checkmark-done" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#1A1A1A" />
          </View>
        ) : isError ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>Failed to load notifications</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.centered}>
            <Ionicons name="notifications-off-outline" size={48} color="#C0BFA8" />
            <Text style={styles.emptyTitle}>No Notifications</Text>
            <Text style={styles.emptySubtitle}>You're all caught up!</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {notifications.map((notif, i) => (
              <NotificationCard
                key={notif.id}
                type={API_TYPE_MAP[notif.type] ?? 'general'}
                title={notif.title}
                name={notif.body}
                timestamp={formatRelativeTime(notif.createdAt)}
                status={notif.actionType !== null ? 'pending' : 'accepted'}
                showActions={notif.actionType !== null}
                onAccept={() => acceptMutation.mutate(notif.id)}
                onDecline={() => declineMutation.mutate({ id: notif.id })}
                onPress={
                  notif.referenceType === 'booking'
                    ? () => router.push('/booking-detail-request' as any)
                    : undefined
                }
                style={i < notifications.length - 1 ? styles.cardMargin : undefined}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F4E8',
  },
  outer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 8,
  },
  cardMargin: {
    marginBottom: 12,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#666',
    fontSize: 14,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  emptySubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: '#999',
  },
});
