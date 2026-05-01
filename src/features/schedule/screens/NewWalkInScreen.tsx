import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { BookingTypeToggle } from '@/src/components/BookingTypeToggle';
import { BookingForm } from '@/src/components/BookingForm';
import { PrimaryButton } from '@/src/components/PrimaryButton';

type BookingType = 'appointment' | 'walkin';

const MOCK_SERVICES = [
  { name: 'Hair Cut', price: 40000, isDefault: true },
];

export function NewWalkInScreen() {
  const router = useRouter();
  const [bookingType, setBookingType] = useState<BookingType>('walkin');
  const [customerName, setCustomerName] = useState('');
  const [contact, setContact] = useState('');
  const [selectedBarber] = useState<string | undefined>();

  function handleBookingTypeChange(type: BookingType) {
    setBookingType(type);
    if (type === 'appointment') {
      router.replace('/new-appointment' as any);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="New Walk-In"
        onBack={() => router.back()}
        rightAction={
          <BookingTypeToggle value={bookingType} onChange={handleBookingTypeChange} />
        }
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <BookingForm
          customerName={customerName}
          onCustomerNameChange={setCustomerName}
          contact={contact}
          onContactChange={setContact}
          selectedBarber={selectedBarber}
          onBarberPress={() => router.push('/select-barber' as any)}
          showDateTimeSelector={false}
          services={MOCK_SERVICES}
          onServicePress={() => router.push('/select-services' as any)}
        />
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton label="New Walk-In" onPress={() => {}} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F4E8',
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
  },
});
