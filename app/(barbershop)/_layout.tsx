import { WorkspaceRoute } from "@/src/components/WorkspaceRoute";
import { Stack } from "expo-router";

export default function ScheduleLayout() {
  return (
    <WorkspaceRoute>
        <Stack screenOptions={{ headerShown: false }} />
    </WorkspaceRoute>
  );
}
