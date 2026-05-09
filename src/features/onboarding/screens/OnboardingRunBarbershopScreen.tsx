import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { OnboardingButton } from "../components/OnboardingButton";
import { OnboardingCard } from "../components/OnboardingCard";
import { OnboardingContainer } from "../components/OnboardingContainer";
import { OnboardingIndicator } from "../components/OnboardingIndicator";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export function OnboardingRunBarbershopScreen() {
  const router = useRouter();

  return (
    <OnboardingContainer style={{ backgroundColor: '#F5F4E8', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
      <View className="flex-1 w-full px-[20px] pb-[24px]">
        <OnboardingCard style={{ height: SCREEN_HEIGHT * 0.42, minHeight: 0, width: '100%', maxWidth: undefined, overflow: 'hidden' }}>
          <View className="flex-1 bg-accent rounded-lg m-[8px] p-[16px] flex-row items-end gap-[16px]">
            {/* Barber with tablet illustration placeholder */}
            <View className="absolute inset-0 bg-accent rounded-lg" />
            <View className="flex-1 items-center justify-end gap-[8px]">
              <View className="w-[60px] h-[120px] bg-dark rounded-lg" />
              <View className="w-[80px] bg-white rounded-[8px] p-[6px] gap-[4px]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <View
                    key={i}
                    className={`h-[6px] rounded-[3px] ${i % 2 === 0 ? 'bg-dark' : 'bg-[#E0E0E0]'}`}
                  />
                ))}
              </View>
            </View>
            <View className="gap-[12px] justify-center mb-[16px]">
              {[true, false, true].map((checked, i) => (
                <View key={i} className="flex-row items-center gap-[8px]">
                  <View
                    className={`w-[16px] h-[16px] rounded-full border-2 border-dark ${checked ? 'bg-dark' : 'bg-transparent'}`}
                  />
                  <View className="w-[48px] h-[6px] rounded-[3px] bg-dark opacity-70" />
                </View>
              ))}
            </View>
          </View>
        </OnboardingCard>

        <OnboardingIndicator current={1} total={3} />

        <View className="mt-[24px] items-center">
          <Text className="text-[26px] font-bold text-black text-center mb-[12px]">
            Run Your Barbershop{"\n"}with Full Control
          </Text>
          <Text className="text-[14px] text-gray text-center leading-[22px]">
            Manage bookings, walk-ins, barbers, and services{"\n"}
            in one system.{"\n"}
            Everything is structured, nothing gets missed.
          </Text>
        </View>

        <View className="flex-1" />

        <OnboardingButton
          label="Next"
          onPress={() => router.push("/onboarding-customer-happy")}
          style={{ marginTop: 0 }}
        />
      </View>
    </OnboardingContainer>
  );
}
