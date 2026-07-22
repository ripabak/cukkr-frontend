import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { WorkspaceRoute } from "@/src/components/WorkspaceRoute";
import { Stack } from "expo-router";

export default function BarbershopLayout() {
  return (
    <ProtectedRoute>
      <WorkspaceRoute>
        <Stack screenOptions={{ headerShown: false }} />
      </WorkspaceRoute>
    </ProtectedRoute>
  );
}
