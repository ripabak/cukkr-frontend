import { DangerButton } from "@/src/components/DangerButton";
import { InfoRow } from "@/src/components/InfoRow";
import { OperationRow } from "@/src/components/OperationRow";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

// --- MOCK DATA ---
const MOCK_BARBERSHOP_NAME = "Barbershop Name";
const MOCK_BARBERSHOP_DESCRIPTION = "Barbershop Description";
const MOCK_BARBERSHOP_ADDRESS = "Address";
const MOCK_BOOK_URL = "https://cukkr.com/hendra-...";

export function BarbershopSettingsScreen() {
  const router = useRouter();

  return (
    <ScreenShell contentStyle={{ paddingBottom: 100 }}>
      <ScreenHeader onBack={() => router.back()} />
      <Text className="text-[28px] font-bold text-dark mt-sm">Barbershop Settings</Text>
      <Text className="text-[14px] text-gray mt-[4px] mb-xl">Setup based on your barbershop needs</Text>

      <View className="items-center">
        <View className="w-20 h-20 rounded-full bg-[#D9D9D9]">
          <View className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-dark items-center justify-center">
            <Ionicons name="camera" size={14} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <Text className="text-[13px] text-gray mb-sm">Information</Text>
      <View className="bg-card rounded-lg">
        <InfoRow
          label="Name"
          value={MOCK_BARBERSHOP_NAME}
          showChevron
          onPress={() => router.push("/edit-barbershop-info")}
        />
        <InfoRow
          label="Description"
          value={MOCK_BARBERSHOP_DESCRIPTION}
          showChevron
          onPress={() => router.push("/edit-barbershop-info")}
        />
        <InfoRow
          label="Address"
          value={MOCK_BARBERSHOP_ADDRESS}
          showChevron
          isLast
          onPress={() => router.push("/edit-barbershop-info")}
        />
      </View>

      <Text className="text-[13px] text-gray mb-sm mt-lg">
        Booking Web
      </Text>
      <View className="bg-card rounded-lg">
        <InfoRow
          label="Book Url"
          value={MOCK_BOOK_URL}
          showChevron
          isLast
          onPress={() => router.push("/edit-booking-url")}
        />
      </View>

      <Text className="text-[13px] text-gray mb-sm mt-lg">
        Operations
      </Text>
      <View className="bg-card rounded-lg">
        <OperationRow label="Barbers" onPress={() => {}} />
        <OperationRow label="Customers" onPress={() => {}} />
        <OperationRow label="Open Hours" isLast onPress={() => {}} />
      </View>

      <Text className="text-[13px] text-gray mb-sm mt-lg">
        Delete Barber
      </Text>
      <DangerButton
        label="Delete This Barbershop"
        onPress={() => {}}
        style={{ marginTop: 8 }}
      />
    </ScreenShell>
  );
}
