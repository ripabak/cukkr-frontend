import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { NotificationCard, NotificationType } from '@/src/components/NotificationCard';

interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  name: string;
  detail?: string;
  timestamp: string;
  status: 'pending' | 'declined' | 'accepted';
  showActions: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    type: 'appointment-request',
    title: 'Appointment Requested',
    name: 'James Comberan',
    detail: 'Scheduled at Sunday, 11 May 2025 8:15 am\nDuration 30m',
    timestamp: '50s ago',
    status: 'pending',
    showActions: true,
  },
  {
    id: '2',
    type: 'appointment-request',
    title: 'Appointment Requested',
    name: 'James Comberan',
    detail: 'Scheduled at Sunday, 11 May 2025 8:15 am\nDuration 30m',
    timestamp: '50s ago',
    status: 'declined',
    showActions: false,
  },
  {
    id: '3',
    type: 'walk-in',
    title: 'Walk-in Arrival',
    name: 'James Comberan',
    detail: 'Arrived at Sunday, 11 May 2025 8:15 am\nDuration 30m',
    timestamp: '30m ago',
    status: 'accepted',
    showActions: false,
  },
  {
    id: '4',
    type: 'invitation',
    title: 'Barbershop Invitation',
    name: 'Pepe Julian',
    detail: 'Invite you to\nHendra Barbershop',
    timestamp: '30m ago',
    status: 'pending',
    showActions: true,
  },
];

export function NotificationsListScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const handleAccept = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'accepted', showActions: false } : n))
    );
  };

  const handleDecline = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: 'declined', showActions: false } : n))
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={styles.moreBtn}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {notifications.map((notif, i) => (
            <NotificationCard
              key={notif.id}
              type={notif.type}
              title={notif.title}
              name={notif.name}
              detail={notif.detail}
              timestamp={notif.timestamp}
              status={notif.status}
              showActions={notif.showActions}
              onAccept={() => handleAccept(notif.id)}
              onDecline={() => handleDecline(notif.id)}
              onPress={
                notif.type === 'appointment-request'
                  ? () => router.push('/booking-detail-request' as any)
                  : undefined
              }
              style={i < notifications.length - 1 ? styles.cardMargin : undefined}
            />
          ))}
        </ScrollView>
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
});
