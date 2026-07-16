import { useMemberRole } from "@/src/hooks";
import { Colors } from "@/src/theme/colors";
import { WorkspaceRoute } from "@/src/components/WorkspaceRoute";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { AppText } from "@/src/components/AppText";

function AnalyticsGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { role, isPending } = useMemberRole();

  useEffect(() => {
    if (!isPending && role === "member") {
      router.replace("/d/(tabs)/home");
    }
  }, [role, isPending, router]);

  if (isPending) return null;
  if (role === "member") return null;

  return children;
}

export default function AnalyticsLayout() {
  return (
    <WorkspaceRoute>
      <AnalyticsGuard>
        <Stack screenOptions={{ headerShown: false }} />
      </AnalyticsGuard>
    </WorkspaceRoute>
  );
}
