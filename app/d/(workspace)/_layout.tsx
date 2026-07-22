import { ProtectedRoute } from "@/src/components/ProtectedRoute";
import { CreateBarbershopProvider } from "@/src/features/workspace";
import { Stack } from "expo-router";

export default function WorkspaceLayout() {
  return (
    <ProtectedRoute>
      <CreateBarbershopProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        ></Stack>
      </CreateBarbershopProvider>
    </ProtectedRoute>
  );
}
