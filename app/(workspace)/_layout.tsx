import { CreateBarbershopProvider } from "@/src/features/workspace";
import { Stack } from "expo-router";

export default function WorkspaceLayout() {
  return (
    <CreateBarbershopProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="switch-barbershop" options={{ animation: "none" }} />
      </Stack>
    </CreateBarbershopProvider>
  );
}
