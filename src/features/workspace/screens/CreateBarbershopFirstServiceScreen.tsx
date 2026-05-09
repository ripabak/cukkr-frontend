import { MultilineInputField } from "@/src/components/MultilineInputField";
import { PrefixedInputField } from "@/src/components/PrefixedInputField";
import { ScreenShell } from "@/src/components/ScreenShell";
import { TextInputField } from "@/src/components/TextInputField";
import { WizardProgress } from "@/src/components/WizardProgress";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// --- MOCK DATA ---
const MOCK_INITIAL_PRICE = "40000";
const MOCK_INITIAL_DURATION = "30";

export function CreateBarbershopFirstServiceScreen() {
  const router = useRouter();
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(MOCK_INITIAL_PRICE);
  const [duration, setDuration] = useState(MOCK_INITIAL_DURATION);

  return (
    <ScreenShell contentStyle={{ flexGrow: 1, padding: 24 }}>
      <WizardProgress totalSteps={3} currentStep={2} style={{ marginBottom: 32 }} />
      <Text className="text-[26px] font-bold text-dark">Create Your First Service</Text>
      <Text className="text-[13px] text-gray mt-sm mb-xxl text-center">
        This will be the default service for your barbershop. You can change it
        anytime.
      </Text>
      <TextInputField
        label="Name"
        placeholder="Service Name"
        value={serviceName}
        onChangeText={setServiceName}
      />
      <MultilineInputField
        label="Description (Optional)"
        placeholder="Service Description"
        value={description}
        onChangeText={setDescription}
        style={{ marginTop: 16 }}
      />
      <Text className="text-[13px] text-gray mb-[6px] mt-lg">Price</Text>
      <PrefixedInputField prefix="Rp" value={price} onChangeText={setPrice} />
      <Text className="text-[13px] text-gray mb-[6px] mt-lg">Duration</Text>
      <PrefixedInputField
        prefix="In Minutes"
        value={duration}
        onChangeText={setDuration}
      />
      <View className="flex-1 min-h-[32px]" />
      <TouchableOpacity
        className="bg-accent rounded-full py-lg items-center mb-lg"
        activeOpacity={0.8}
        onPress={() => router.push("/create-barbershop-success")}
      >
        <Text className="text-[16px] font-semibold text-dark">Finish</Text>
      </TouchableOpacity>
    </ScreenShell>
  );
}
