import { GradientButton } from "@/src/components/GradientButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text } from "react-native";

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
      <Text style={styles.title}>Congratulation 🎉</Text>
      <Text style={styles.subtitle}>
        {`Your barbershop, "${MOCK_BARBERSHOP_NAME}," has been created.`}
      </Text>
      <GradientButton
        label="Open My Barbershop"
        icon="login"
        style={styles.button}
        onPress={() => router.replace("/home-dashboard")}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginTop: 12,
  },
  button: {
    marginTop: 48,
  },
});
