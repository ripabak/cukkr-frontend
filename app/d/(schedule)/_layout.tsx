import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { WorkspaceRoute } from "@/src/components/WorkspaceRoute";
import { NewBookingProvider } from "@/src/features/schedule/context/NewBookingContext";
import { Stack } from "expo-router";

export default function ScheduleLayout() {
  return (
    <ProtectedRoute>
      <WorkspaceRoute>
        <NewBookingProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </NewBookingProvider>
      </WorkspaceRoute>
    </ProtectedRoute>
  );
}
