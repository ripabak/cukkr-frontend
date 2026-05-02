import { ImageUploadBox } from "@/src/components/ImageUploadBox";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/components/WizardProgress";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export function CreateBarbershopNameLogoScreen() {
  const router = useRouter();
  const [name, setName] = useState("");

  return (
    <ScreenShell contentStyle={{ flexGrow: 1, padding: 24 }}>
      <WizardProgress totalSteps={3} currentStep={0} style={styles.wizard} />
      <Text style={styles.title}>Create Barbershop</Text>
      <Text style={styles.subtitle}>Set up your own barbershop</Text>
      <TextInputField
        label="Barbershop Name"
        placeholder="Barbershop name"
        value={name}
        onChangeText={setName}
      />
      <Text style={styles.logoLabel}>Logo</Text>
      <ImageUploadBox label="Choose Image" style={styles.imageUpload} />
      <View style={styles.flex} />
      <PrimaryButton
        label="Create"
        style={styles.button}
        onPress={() => router.push("/create-barbershop-invite-barber-empty")}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  wizard: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 8,
    marginBottom: 24,
  },
  logoLabel: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 6,
    marginTop: 16,
  },
  imageUpload: {
    marginTop: 0,
  },
  flex: {
    flex: 1,
    minHeight: 32,
  },
  button: {
    marginBottom: 16,
  },
});
