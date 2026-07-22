import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <ProtectedRoute>
      <Stack screenOptions={{ headerShown: false }} />
    </ProtectedRoute>
  );
}
