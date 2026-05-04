import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
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
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {isOld ? 'Verify Old Contact' : 'Verify New Contact'}
        </Text>
        <Text style={styles.subtitle}>
          {isOld
            ? 'OTP sent to your old email/phone number*'
            : 'OTP sent to your new email/phone number*'}
        </Text>
        <Text style={styles.contact}>julianpepe@gmail.com</Text>

        <View style={styles.otpWrapper}>
          <OtpCodeInput value={otp} onChange={setOtp} autoFocus={false} />
        </View>

        <Text style={styles.timer}>05:00</Text>

        <View style={styles.buttons}>
          <SecondaryButton label="Send Again" onPress={() => {}} style={styles.sendAgainBtn} />
          <PrimaryButton
            label={isOld ? 'Continue' : 'Verify'}
            onPress={() => router.back()}
            style={styles.primaryBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F4E8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: -12,
  },
  contact: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
    textAlign: 'center',
  },
  otpWrapper: {
    width: '100%',
  },
  timer: {
    fontSize: 28,
    fontWeight: '400',
    color: '#1A1A1A',
    letterSpacing: 1,
  },
  buttons: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  sendAgainBtn: {
    borderColor: '#C6ED3C',
  },
  primaryBtn: {
    backgroundColor: '#C6ED3C',
  },
});
