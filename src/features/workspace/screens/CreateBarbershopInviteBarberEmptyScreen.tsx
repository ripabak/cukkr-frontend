import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SecondaryButton } from "@/src/components/SecondaryButton";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/components/WizardProgress";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export function CreateBarbershopInviteBarberEmptyScreen() {
  const router = useRouter();
  const [barber, setBarber] = useState("");

  return (
    <ScreenShell contentStyle={{ flexGrow: 1, padding: 24 }}>
      <WizardProgress totalSteps={3} currentStep={1} style={styles.wizard} />
      <Text style={styles.title}>Invite Barber</Text>
      <Text style={styles.subtitle}>Inviting barber to your barbershop</Text>
      <TextInputField
        label="Add Barber"
        placeholder="email / phone number *"
        value={barber}
        onChangeText={setBarber}
      />
      <SecondaryButton label="Invite" style={styles.inviteBtn} />
      <View style={styles.flex} />
      <PrimaryButton
        label="Skip"
        onPress={() => router.push("/create-barbershop-first-service")}
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
    marginBottom: 32,
  },
  inviteBtn: {
    marginTop: 12,
    alignSelf: "center",
    width: "auto",
    paddingHorizontal: 32,
  },
  flex: {
    flex: 1,
  },
});
