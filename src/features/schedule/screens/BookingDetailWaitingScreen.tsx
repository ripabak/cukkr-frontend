import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BookingDetailCard } from '@/src/components/BookingDetailCard';
import { StickyCta } from '@/src/components/StickyCta';
import { OverflowMenu } from '@/src/components/OverflowMenu';
import { ConfirmationModal } from '@/src/components/ConfirmationModal';

const MOCK_BOOKING = {
  customerName: 'Ethan James',
  dateLabel: 'Sunday, 11 May 2025',
  metaLine1: 'Arrived at 8:15 am (12m ago)',
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

type ModalType = 'cancel' | 'start' | 'takeover' | null;

export function BookingDetailWaitingScreen() {
  const router = useRouter();
  const [overflowVisible, setOverflowVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(null);

  const handleHandle = () => setModalType('start');

  const handleConfirmStart = () => {
    setModalType(null);
    router.push('/booking-detail-in-progress' as any);
  };

  const handleConfirmCancel = () => {
    setModalType(null);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4E8' }}>
      <View className="flex-1">
        {/* Nav bar */}
        <View className="flex-row justify-between items-center px-xl pt-sm pb-xs">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="w-10 h-10 rounded-full bg-[#F0F0E8] items-center justify-center">
            <Ionicons name="chevron-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setOverflowVisible(true)}
            activeOpacity={0.7}
            className="w-10 h-10 rounded-full bg-dark items-center justify-center"
          >
            <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <BookingDetailCard
          customerName={MOCK_BOOKING.customerName}
          dateLabel={MOCK_BOOKING.dateLabel}
          metaIcon="people"
          metaLine1={MOCK_BOOKING.metaLine1}
          metaLine2={MOCK_BOOKING.metaLine2}
          status="waiting"
          infoRows={MOCK_BOOKING.infoRows}
          services={MOCK_BOOKING.services}
          notes={MOCK_BOOKING.notes}
          paymentSummary={MOCK_BOOKING.paymentSummary}
          onWhatsApp={() => {}}
        />

        <StickyCta label="Handle this" onPress={handleHandle} />

        {/* Overflow menu */}
        {overflowVisible ? (
          <View className="absolute inset-0 z-50">
            <OverflowMenu
              visible
              items={[
                {
                  label: 'Cancel Book',
                  danger: true,
                  onPress: () => setModalType('cancel'),
                },
              ]}
              onClose={() => setOverflowVisible(false)}
            />
          </View>
        ) : null}

        {/* Start booking modal */}
        <ConfirmationModal
          visible={modalType === 'start'}
          icon="cut"
          title="Start this booking?"
          description="This will mark the booking as In Progress. Please make sure you are ready to serve the customer before continuing."
          confirmLabel="Yes"
          cancelLabel="No, Not Yet"
          onConfirm={handleConfirmStart}
          onCancel={() => setModalType(null)}
        />

        {/* Cancel booking modal */}
        <ConfirmationModal
          visible={modalType === 'cancel'}
          icon="close-circle"
          title="Cancel this booking?"
          description="This action cannot be undone. The customer will be notified."
          confirmLabel="Yes, Cancel"
          cancelLabel="No"
          onConfirm={handleConfirmCancel}
          onCancel={() => setModalType(null)}
        />

        {/* Takeover modal */}
        <ConfirmationModal
          visible={modalType === 'takeover'}
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


