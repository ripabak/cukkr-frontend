import '../global.css';

import { QueryProvider } from "@/src/lib/providers";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Stack } from 'expo-router';

export {
  ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <QueryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="d" options={{ headerShown: false }} />
      </Stack>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryProvider>
  );
}
