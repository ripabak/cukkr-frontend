import { GradientButton } from "@/src/components/GradientButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { useRouter } from "expo-router";
import React from "react";
import { Text } from "react-native";

// --- MOCK DATA ---
const MOCK_BARBERSHOP_NAME = "Hendra Barbershop";

export function CreateBarbershopSuccessScreen() {
  const router = useRouter();

  return (
    <ScreenShell
      contentStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
      }}
    >
      <Text className="text-[26px] font-bold text-dark text-center">Congratulation 🎉</Text>
      <Text className="text-[14px] text-gray text-center mt-md">
        {`Your barbershop, "${MOCK_BARBERSHOP_NAME}," has been created.`}
      </Text>
      <GradientButton
        label="Open My Barbershop"
        icon="login"
        style={{ marginTop: 48 }}
        onPress={() => router.replace("/home-dashboard")}
      />
    </ScreenShell>
  );
}
