import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScreenHeader } from '@/src/components/ScreenHeader';
import { BookingTypeToggle } from '@/src/components/BookingTypeToggle';
import { BookingForm } from '@/src/components/BookingForm';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { CalendarModal } from '@/src/components/CalendarModal';
import { TimePickerModal } from '@/src/components/TimePickerModal';

type BookingType = 'appointment' | 'walkin';

const MOCK_SERVICES = [
  { name: 'Hair Cut', price: 40000, isDefault: true },
];

function formatTime(h: number, m: number, amPm: 'AM' | 'PM'): string {
  const mm = m < 10 ? `0${m}` : String(m);
  return `${h}:${mm} ${amPm}`;
}

export function NewAppointmentScreen() {
  const router = useRouter();
  const [bookingType, setBookingType] = useState<BookingType>('appointment');
  const [customerName, setCustomerName] = useState('');
  const [contact, setContact] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState<string | undefined>();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  function handleDateSelect(date: Date) {
    setSelectedDate(date);
    setShowCalendar(false);
    setShowTimePicker(true);
  }

  function handleTimeConfirm(h: number, m: number, amPm: 'AM' | 'PM') {
    if (selectedDate) {
      const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const label = `${dayLabels[selectedDate.getDay()]}, ${selectedDate.getDate()} ${monthLabels[selectedDate.getMonth()]} ${selectedDate.getFullYear()} ${formatTime(h, m, amPm)}`;
      setSelectedDateTime(label);
    }
    setShowTimePicker(false);
  }

  function handleBookingTypeChange(type: BookingType) {
    setBookingType(type);
    if (type === 'walkin') {
      router.replace('/new-walk-in' as any);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="New Appointment"
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
          onBarberPress={() => router.push('/select-barber' as any)}
          selectedDateTime={selectedDateTime}
          onDateTimePress={() => setShowCalendar(true)}
          showDateTimeSelector
          services={MOCK_SERVICES}
          onServicePress={() => router.push('/select-services' as any)}
        />
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton label="New Appointment" onPress={() => {}} />
      </View>
      <CalendarModal
        visible={showCalendar}
        selectedDate={selectedDate}
        onSelect={handleDateSelect}
        onClose={() => setShowCalendar(false)}
      />
      <TimePickerModal
        visible={showTimePicker}
        onConfirm={handleTimeConfirm}
        onClose={() => setShowTimePicker(false)}
      />
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
    gap: 14,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
  },
});
