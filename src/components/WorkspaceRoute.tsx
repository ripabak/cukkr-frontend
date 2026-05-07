import { useWorkspaceGuard } from "@/src/hooks/useWorkspaceGuard";
import React from "react";
import { ActivityIndicator, View } from "react-native";

interface WorkspaceRouteProps {
  children: React.ReactNode;
}

export function WorkspaceRoute({ children }: WorkspaceRouteProps) {
  const { isLoading, hasWorkspace } = useWorkspaceGuard();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1A1A1A" />
      </View>
    );
  }

  if (!hasWorkspace) {
    return null;
  }

  return <>{children}</>;
}
