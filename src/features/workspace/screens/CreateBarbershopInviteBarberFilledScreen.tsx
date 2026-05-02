import { InviteRow } from "@/src/components/InviteRow";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SecondaryButton } from "@/src/components/SecondaryButton";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/components/WizardProgress";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

// --- MOCK DATA ---
const MOCK_INVITED_BARBERS = [
  { id: "1", email: "rifa@gmail.com" },
  { id: "2", email: "rifafaruqi@gmail.com" },
];

export function CreateBarbershopInviteBarberFilledScreen() {
  const router = useRouter();
  const [barber, setBarber] = useState("");

  return (
    <ScreenShell contentStyle={{ flexGrow: 1, padding: 24 }}>
      <WizardProgress totalSteps={3} currentStep={1} style={styles.wizard} />
      <Text style={styles.title}>Invite Barber</Text>
      <Text style={styles.subtitle}>Inviting barber to your barbershop</Text>
      <Text style={styles.barbersLabel}>{"Barbershop's barbers"}</Text>
      {MOCK_INVITED_BARBERS.map((barber, index) => (
        <InviteRow
          key={barber.id}
          email={barber.email}
          onRemove={() => {}}
          style={index > 0 ? styles.inviteRowTop : undefined}
        />
      ))}
      <TextInputField
        label="Add Barber"
        placeholder="email / phone number *"
        value={barber}
        onChangeText={setBarber}
        style={styles.inputTop}
      />
      <SecondaryButton label="Invite" style={styles.inviteBtn} />
      <View style={styles.flex} />
      <PrimaryButton
        label="Next"
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
    marginBottom: 24,
  },
  barbersLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  inviteRowTop: {
    marginTop: 8,
  },
  inputTop: {
    marginTop: 16,
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
