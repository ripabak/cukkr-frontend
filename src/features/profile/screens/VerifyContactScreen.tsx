import { Colors } from '@/src/theme/colors';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { SecondaryButton } from '@/src/components/SecondaryButton';
import { OtpCodeInput } from '@/src/features/auth/components/OtpCodeInput';
import { useToast } from '@/src/lib/providers/toast';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useVerifyPhoneChange, useChangePhone } from '../hooks';
import { getErrorMessage } from '../utils/error-handler';

type ContactType = 'email' | 'phone';

export function VerifyContactScreen() {
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ contact?: string; type?: ContactType }>();

  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [canResend, setCanResend] = useState(false);

  const contactType: ContactType = params.type ?? 'phone';
  const contact = params.contact ?? '';

  const { mutateAsync: verifyPhoneChange, isPending: verifying } = useVerifyPhoneChange();
  const { mutateAsync: changePhone, isPending: resending } = useChangePhone();
  const isLoading = verifying || resending;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    try {
      if (contactType === 'phone') {
        await verifyPhoneChange({ phone: contact, otp });
      } else {
        toast.error('Email verification not yet implemented');
        return;
      }
      toast.success('Contact verified successfully');
      router.back();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleResend = async () => {
    try {
      if (contactType === 'phone') {
        await changePhone(contact);
      } else {
        toast.error('Email verification not yet implemented');
        return;
      }
      setTimeLeft(300);
      setCanResend(false);
      toast.success('OTP sent successfully');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <View style={[styles.safe, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify New Contact</Text>
        <Text style={styles.subtitle}>OTP sent to your new {contactType}</Text>
        <Text style={styles.contact}>{contact}</Text>

        <View style={styles.otpWrapper}>
          <OtpCodeInput value={otp} onChange={setOtp} length={6} autoFocus={false} />
        </View>

        <Text style={styles.timer}>{timeDisplay}</Text>

        <View style={styles.buttons}>
          <View style={(!canResend || isLoading) ? styles.disabledButtonContainer : undefined}>
            <SecondaryButton
              label={resending ? "Sending..." : "Send Again"}
              onPress={!canResend || isLoading ? undefined : handleResend}
              style={styles.sendAgainBtn}
            />
          </View>
          <PrimaryButton
            label={verifying ? "Verifying..." : "Verify"}
            onPress={handleVerify}
            disabled={isLoading || otp.length !== 6}
            style={styles.primaryBtn}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg.default,
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
    color: Colors.text.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: -12,
  },
  contact: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  otpWrapper: {
    width: '100%',
  },
  timer: {
    fontSize: 28,
    fontWeight: '400',
    color: Colors.text.primary,
    letterSpacing: 1,
  },
  buttons: {
    width: '100%',
    gap: 12,
    marginTop: 8,
  },
  sendAgainBtn: {
    borderColor: Colors.brand.primary,
  },
  primaryBtn: {
    backgroundColor: Colors.brand.primary,
  },
  disabledButtonContainer: {
    opacity: 0.5,
  },
});
