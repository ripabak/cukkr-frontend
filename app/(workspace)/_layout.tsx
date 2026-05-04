import { CreateBarbershopProvider } from "@/src/features/workspace";
import { Stack } from "expo-router";

export default function WorkspaceLayout() {
  return (
    <CreateBarbershopProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </CreateBarbershopProvider>
  );
}
