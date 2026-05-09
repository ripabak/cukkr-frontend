import { ImageUploadBox } from "@/src/components/ImageUploadBox";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/components/WizardProgress";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

export function CreateBarbershopNameLogoScreen() {
  const router = useRouter();
  const [name, setName] = useState("");

  return (
    <ScreenShell contentStyle={{ flexGrow: 1, padding: 24 }}>
      <WizardProgress totalSteps={3} currentStep={0} style={{ marginBottom: 32 }} />
      <Text className="text-[28px] font-bold text-dark">Create Barbershop</Text>
      <Text className="text-[14px] text-gray mt-sm mb-xxl">Set up your own barbershop</Text>
      <TextInputField
        label="Barbershop Name"
        placeholder="Barbershop name"
        value={name}
        onChangeText={setName}
      />
      <Text className="text-label text-gray mb-[6px] mt-lg">Logo</Text>
      <ImageUploadBox label="Choose Image" />
      <View className="flex-1 min-h-[32px]" />
      <PrimaryButton
        label="Create"
        style={{ marginBottom: 16 }}
        onPress={() => router.push("/create-barbershop-invite-barber-empty")}
      />
    </ScreenShell>
  );
}
