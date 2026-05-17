import { PublicBookingProvider } from '@/src/features/public-booking/context/PublicBookingContext';
import { Stack } from 'expo-router';

export default function SlugLayout() {
  return (
    <PublicBookingProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </PublicBookingProvider>
  );
}
