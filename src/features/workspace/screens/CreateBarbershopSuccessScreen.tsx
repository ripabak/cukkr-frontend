import { GradientButton } from "@/src/components/GradientButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { useCreateBarbershopForm } from "../context/CreateBarbershopContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";

export function CreateBarbershopSuccessScreen() {
  const router = useRouter();
  const { formData, resetFormData } = useCreateBarbershopForm();
  const barbershopName = formData.name || "Your Barbershop";

  const handleOpenBarbershop = async () => {
    resetFormData();
    router.replace("/");
  };

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
        {`Your barbershop, "${barbershopName}," has been created.`}
      </Text>
      <GradientButton
        label="Open My Barbershop"
        style={styles.button}
        onPress={handleOpenBarbershop}
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
