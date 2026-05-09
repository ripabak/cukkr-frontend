import React, { useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { OtpCodeInput } from '@/src/features/auth/components/OtpCodeInput';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { SecondaryButton } from '@/src/components/SecondaryButton';

type ContactStep = 'old' | 'new';

export function VerifyContactScreen() {
  const router = useRouter();
  const [step] = useState<ContactStep>('old');
  const [otp, setOtp] = useState('');

  const isOld = step === 'old';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4E8' }}>
      <View className="flex-1 px-xxxl justify-center items-center gap-xl">
        <Text className="text-[26px] font-bold text-dark text-center">
          {isOld ? 'Verify Old Contact' : 'Verify New Contact'}
        </Text>
        <Text className="text-sm text-gray text-center -mb-md">
          {isOld
            ? 'OTP sent to your old email/phone number*'
            : 'OTP sent to your new email/phone number*'}
        </Text>
        <Text className="text-sm font-semibold text-dark text-center">julianpepe@gmail.com</Text>

        <View className="w-full">
          <OtpCodeInput value={otp} onChange={setOtp} autoFocus={false} />
        </View>

        <Text className="text-[28px] text-dark tracking-widest">05:00</Text>

        <View className="w-full gap-md mt-sm">
          <SecondaryButton label="Send Again" onPress={() => {}} style={{ borderColor: '#C6ED3C' }} />
          <PrimaryButton
            label={isOld ? 'Continue' : 'Verify'}
            onPress={() => router.back()}
            style={{ backgroundColor: '#C6ED3C' }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

