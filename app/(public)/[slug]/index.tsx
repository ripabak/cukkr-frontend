import { PublicLandingScreen } from '@/src/features/public-booking/screens/PublicLandingScreen';
import { useLocalSearchParams } from 'expo-router';

export default function PublicLandingPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <PublicLandingScreen slug={slug} />;
}
