import { PublicAppointmentScreen } from '@/src/features/public-booking/screens/PublicAppointmentScreen';
import { useLocalSearchParams } from 'expo-router';

export default function PublicAppointmentPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <PublicAppointmentScreen slug={slug} />;
}
