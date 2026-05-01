import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BookingDetailCard, BookingDetailStatus } from '@/src/components/BookingDetailCard';

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

interface Props {
  status?: BookingDetailStatus;
}

export function BookingDetailResultScreen({ status = 'completed' }: Props) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        {/* Nav bar — back only, no overflow */}
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
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
    alignSelf: 'flex-start',
  },
});
