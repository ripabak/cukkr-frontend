import { EditFieldHeader } from "@/src/components/EditFieldHeader";
import { HelperCopy } from "@/src/components/HelperCopy";
import { PrefixedInputField } from "@/src/components/PrefixedInputField";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- MOCK DATA ---
const MOCK_BOOKING_SLUG = "hendra-barbershop";

export function EditBookingUrlScreen() {
  const router = useRouter();
  const [slug, setSlug] = useState(MOCK_BOOKING_SLUG);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#EEEEE0' }}>
      <View className="flex-1">
        <EditFieldHeader
          title="Book Url"
          onBack={() => router.back()}
          onSave={() => router.back()}
        />
        <View className="flex-1 px-[20px] pt-lg">
          <PrefixedInputField
            prefix="https://cukkr.com/"
            value={slug}
            onChangeText={setSlug}
          />
          <HelperCopy
            lines={[
              "This is your public booking link that customers use to make appointments.",
              "Use only letters, numbers, and hyphens.",
            ]}
            errorLine="Spaces are not allowed."
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
