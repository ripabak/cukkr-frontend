import { InviteRow } from "@/src/components/InviteRow";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SecondaryButton } from "@/src/components/SecondaryButton";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/components/WizardProgress";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

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
      <WizardProgress totalSteps={3} currentStep={1} style={{ marginBottom: 32 }} />
      <Text className="text-[28px] font-bold text-dark">Invite Barber</Text>
      <Text className="text-[14px] text-gray mt-sm mb-xxl">Inviting barber to your barbershop</Text>
      <Text className="text-[15px] font-semibold text-dark mb-md">{"Barbershop's barbers"}</Text>
      {MOCK_INVITED_BARBERS.map((barber, index) => (
        <InviteRow
          key={barber.id}
          email={barber.email}
          onRemove={() => {}}
          style={index > 0 ? { marginTop: 8 } : undefined}
        />
      ))}
      <TextInputField
        label="Add Barber"
        placeholder="email / phone number *"
        value={barber}
        onChangeText={setBarber}
        style={{ marginTop: 16 }}
      />
      <SecondaryButton label="Invite" style={{ marginTop: 12, alignSelf: 'center', paddingHorizontal: 32 }} />
      <View className="flex-1" />
      <PrimaryButton
        label="Next"
        onPress={() => router.push("/create-barbershop-first-service")}
      />
    </ScreenShell>
  );
}
