import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SecondaryButton } from "@/src/components/SecondaryButton";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/components/WizardProgress";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

export function CreateBarbershopInviteBarberEmptyScreen() {
  const router = useRouter();
  const [barber, setBarber] = useState("");

  return (
    <ScreenShell contentStyle={{ flexGrow: 1, padding: 24 }}>
      <WizardProgress totalSteps={3} currentStep={1} style={{ marginBottom: 32 }} />
      <Text className="text-[28px] font-bold text-dark">Invite Barber</Text>
      <Text className="text-[14px] text-gray mt-sm mb-xxxl">Inviting barber to your barbershop</Text>
      <TextInputField
        label="Add Barber"
        placeholder="email / phone number *"
        value={barber}
        onChangeText={setBarber}
      />
      <SecondaryButton label="Invite" style={{ marginTop: 12, alignSelf: 'center', paddingHorizontal: 32 }} />
      <View className="flex-1" />
      <PrimaryButton
        label="Skip"
        onPress={() => router.push("/create-barbershop-first-service")}
      />
    </ScreenShell>
  );
}
