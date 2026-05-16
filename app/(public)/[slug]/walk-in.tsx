import { PublicWalkInScreen } from '@/src/features/public-booking/screens/PublicWalkInScreen';
import { useLocalSearchParams } from 'expo-router';

export default function PublicWalkInPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  return <PublicWalkInScreen slug={slug} />;
}
