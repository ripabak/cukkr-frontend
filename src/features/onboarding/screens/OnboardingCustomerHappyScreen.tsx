import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { OnboardingButton } from "../components/OnboardingButton";
import { OnboardingCard } from "../components/OnboardingCard";
import { OnboardingContainer } from "../components/OnboardingContainer";
import { OnboardingIndicator } from "../components/OnboardingIndicator";
import { useOnboardingStore } from "../stores/onboardingStore";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export function OnboardingCustomerHappyScreen() {
  const router = useRouter();
  const markOnboardingSeen = useOnboardingStore((s) => s.markOnboardingSeen);

  return (
    <OnboardingContainer style={{ backgroundColor: '#F5F4E8', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
      <View className="flex-1 w-full px-[20px] pb-[24px]">
        <OnboardingCard style={{ height: SCREEN_HEIGHT * 0.42, minHeight: 0, width: '100%', maxWidth: undefined, overflow: 'hidden' }}>
          <View className="flex-1 flex-row items-end justify-around p-[16px] bg-[#F0F5E8] rounded-lg m-[8px]">
            {/* Customer and barber illustration placeholder */}
            <View className="items-center gap-[4px]">
              <View className="w-[36px] h-[36px] rounded-full bg-dark opacity-[0.15]" />
              <View className="w-[44px] h-[80px] rounded-[8px] bg-dark opacity-20" />
              <View className="w-[24px] h-[40px] rounded-[6px] bg-accent" />
            </View>
            <View className="items-center justify-center gap-[8px]">
              <View className="w-[72px] h-[72px] rounded-full bg-accent justify-center items-center">
                <View className="w-[36px] h-[36px] rounded-full border-[3px] border-dark bg-transparent" />
              </View>
              <View
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: 12,
                  borderRightWidth: 12,
                  borderBottomWidth: 20,
                  borderLeftColor: 'transparent',
                  borderRightColor: 'transparent',
                  borderBottomColor: '#C6FF4D',
                }}
              />
            </View>
            <View className="items-center gap-[4px]">
              <View className="w-[36px] h-[36px] rounded-full bg-dark opacity-[0.15]" />
              <View className="w-[44px] h-[80px] rounded-[8px] bg-dark opacity-50" />
              <View className="w-[24px] h-[20px] rounded-[4px] bg-dark opacity-40" />
            </View>
          </View>
        </OnboardingCard>

        <OnboardingIndicator current={2} total={3} />

        <View className="mt-[24px] items-center">
          <Text className="text-[26px] font-bold text-black text-center mb-[12px]">Customer Happy,{"\n"}Barber Happy</Text>
          <Text className="text-[14px] text-gray text-center leading-[22px]">
            Smooth bookings for customers, clear schedules{"\n"}
            for barbers.{"\n"}
            Everyone knows what to do, every day.
          </Text>
        </View>

        <View className="flex-1" />

        <OnboardingButton
          label="Get Started"
          onPress={() => {
            markOnboardingSeen();
            router.replace("/login");
          }}
          variant="secondary"
          style={{ marginTop: 0 }}
        />
      </View>
    </OnboardingContainer>
  );
}
