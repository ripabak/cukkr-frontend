import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BookingDetailCard } from '@/src/components/BookingDetailCard';
import { StickyCta } from '@/src/components/StickyCta';
import { OverflowMenu } from '@/src/components/OverflowMenu';
import { SwipeConfirmationModal } from '@/src/components/SwipeConfirmationModal';

const MOCK_BOOKING = {
  customerName: 'Ethan James',
  dateLabel: 'Sunday, 11 May 2025',
  metaLine1: 'Scheduled at 8:15 am',
  metaLine2: 'Duration 30m',
  infoRows: [
    { label: 'Book No', value: '#BOOK-12345' },
    { label: 'Requested', value: '⚙ Pepe Julian' },
    { label: 'Handled By', value: '⚙ Pepe Julian' },
  ],
  services: [
    { name: 'Hair Cut (20m)', price: 'Rp. 40,000' },
    { name: 'Hair Dying (10m)', price: 'Rp. 100,000' },
  ],
  notes: 'Tolong perlu banget pangkas sore ini bang, acc ya plsssssss.',
  paymentSummary: [
    { label: 'Services (2)', value: 'Rp. 140,000' },
    { label: 'Discount', value: '-Rp. 40,000' },
  ],
};

export function BookingDetailInProgressScreen() {
  const router = useRouter();
  const [overflowVisible, setOverflowVisible] = useState(false);
  const [swipeModalVisible, setSwipeModalVisible] = useState(false);

  const handleComplete = () => {
    setSwipeModalVisible(false);
    router.push('/booking-detail-result' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        {/* Nav bar */}
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
          customerName={MOCK_BOOKING.customerName}
          dateLabel={MOCK_BOOKING.dateLabel}
          metaIcon="calendar"
          metaLine1={MOCK_BOOKING.metaLine1}
          metaLine2={MOCK_BOOKING.metaLine2}
          status="in-progress"
          infoRows={MOCK_BOOKING.infoRows}
          services={MOCK_BOOKING.services}
          notes={MOCK_BOOKING.notes}
          paymentSummary={MOCK_BOOKING.paymentSummary}
          onWhatsApp={() => {}}
        />

        <StickyCta
          label="Complete"
          onPress={() => setSwipeModalVisible(true)}
          color="#55C46B"
          textColor="#FFFFFF"
        />

        {/* Overflow menu */}
        {overflowVisible ? (
          <View style={styles.menuOverlay}>
            <OverflowMenu
              visible
              items={[
                {
                  label: 'Mark as Waiting',
                  onPress: () => router.push('/booking-detail-waiting' as any),
                },
              ]}
              onClose={() => setOverflowVisible(false)}
            />
          </View>
        ) : null}

        {/* Swipe completion modal */}
        <SwipeConfirmationModal
          visible={swipeModalVisible}
          title="Complete Booking?"
          description={
            'This action will finalize the booking and cannot be undone.\n\nPlease make sure the service and details are correct before continuing.'
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
    backgroundColor: '#F5F4E8',
  },
  outer: {
    flex: 1,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F0E8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overflowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
});
