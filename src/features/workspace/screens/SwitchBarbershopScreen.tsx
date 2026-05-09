import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { SelectionRow } from "@/src/components/SelectionRow";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- MOCK DATA ---
const MOCK_BARBERSHOPS = [
  { id: "1", label: "Hendra Barbershop" },
  { id: "2", label: "Matraman Barber" },
];

export function SwitchBarbershopScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EEEEE0' }}>
      <View className="flex-1 p-xxl">
        <ScreenHeader onBack={() => router.back()} />
        <Text className="text-[32px] font-bold text-dark mt-xxl">Switch Barbershop</Text>
        <Text className="text-[15px] text-gray mt-sm">
          {"Choose barbershop u're working on"}
        </Text>
        <View className="mt-xxxl" />
        {MOCK_BARBERSHOPS.map((shop, index) => (
          <SelectionRow
            key={shop.id}
            label={shop.label}
            onPress={() => router.back()}
            isLast={index === MOCK_BARBERSHOPS.length - 1}
          />
        ))}
        <View className="flex-1" />
        <PrimaryButton
          label="Create New Barbershop"
          onPress={() => router.push("/create-barbershop-name-logo")}
        />
      </View>
    </SafeAreaView>
  );
}
