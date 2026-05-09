import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, Text, View } from "react-native";
import { OnboardingButton } from "../components/OnboardingButton";
import { OnboardingCard } from "../components/OnboardingCard";
import { OnboardingContainer } from "../components/OnboardingContainer";
import { OnboardingIndicator } from "../components/OnboardingIndicator";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export function OnboardingEasyBookingScreen() {
  const router = useRouter();

  return (
    <OnboardingContainer style={{ backgroundColor: '#F5F4E8', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
      <View className="flex-1 w-full px-[20px] pb-[24px]">
        <OnboardingCard style={{ height: SCREEN_HEIGHT * 0.42, minHeight: 0, width: '100%', maxWidth: undefined, overflow: 'hidden' }}>
          <View className="flex-1 flex-row gap-[8px] p-[16px]">
            {/* Booking calendar illustration placeholder */}
            <View className="flex-1 flex-row flex-wrap gap-[6px] content-start pt-[8px]">
              {Array.from({ length: 20 }).map((_, i) => (
                <View
                  key={i}
                  className={`w-[28px] h-[22px] rounded-[4px] border-[1.5px] ${
                    i % 3 === 0 ? 'bg-accent border-accent' : 'bg-transparent border-dark'
                  }`}
                />
              ))}
            </View>
            <View className="w-[50px] gap-[8px] justify-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <View
                  key={i}
                  className={`h-[16px] rounded-[4px] border-[1.5px] ${
                    i % 2 === 0 ? 'bg-accent border-accent' : 'bg-transparent border-dark'
                  }`}
                />
              ))}
            </View>
          </View>
        </OnboardingCard>

        <OnboardingIndicator current={0} total={3} />

        <View className="mt-[24px] items-center">
          <Text className="text-[26px] font-bold text-black text-center mb-[12px]">Easy Booking with One Link</Text>
          <Text className="text-[14px] text-gray text-center leading-[22px]">
            Share your booking link on social media.{"\n"}
            Customers book by themselves — no chat,{"\n"}
            no back-and-forth.
          </Text>
        </View>

        <View className="flex-1" />

        <OnboardingButton
          label="Love it"
          onPress={() => router.push("/onboarding-run-barbershop")}
          style={{ marginTop: 0 }}
        />
      </View>
    </OnboardingContainer>
  );
}
