import { NewBookingProvider } from "@/src/features/schedule/context/NewBookingContext";
import { Stack } from "expo-router";

export default function ScheduleLayout() {
  return (
    <NewBookingProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </NewBookingProvider>
  );
}
