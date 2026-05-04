import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { OverflowMenu } from '@/src/components/OverflowMenu';
import { BookingDetailCard, BookingDetailStatus } from '@/src/components/BookingDetailCard';
import { DualActionFooter } from '@/src/components/DualActionFooter';

const MOCK_BOOKING = {
  customerName: 'James Comberan',
  dateLabel: 'Sunday, 11 May 2025',
  metaLine1: 'Scheduled at 8:15 am',
  metaLine2: 'Duration 30m',
  infoRows: [
    { label: 'Book No', value: '#BOOK-12345' },
    { label: 'Requested', value: '⚙ Pepe Julian' },
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

export function BookingDetailRequestScreen() {
  const router = useRouter();
  const [status, setStatus] = useState<BookingDetailStatus>('requested');
  const [overflowVisible, setOverflowVisible] = useState(false);

  const isDecided = status === 'declined';

  const handleAccept = () => setStatus('completed');
  const handleDecline = () => setStatus('declined');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        {/* Back + overflow header */}
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
          status={status}
          infoRows={MOCK_BOOKING.infoRows}
          services={MOCK_BOOKING.services}
          notes={MOCK_BOOKING.notes}
          paymentSummary={MOCK_BOOKING.paymentSummary}
          onWhatsApp={() => {}}
        />

        {!isDecided ? (
          <DualActionFooter onDecline={handleDecline} onAccept={handleAccept} />
        ) : null}

        {overflowVisible ? (
          <View style={styles.menuOverlay}>
            <OverflowMenu
              visible
              items={[{ label: 'Cancel Book', danger: true, onPress: () => {} }]}
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
