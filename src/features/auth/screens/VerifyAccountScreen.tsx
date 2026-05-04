import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useToast } from "@/src/lib/providers";
import { authTheme } from "../auth-theme";
import { AuthButton } from "../components/AuthButton";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { OtpCodeInput } from "../components/OtpCodeInput";
import { otpService } from "../services";

function useCountdown(initialSeconds: number) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive || secondsLeft === 0) {
      setIsActive(false);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const reset = () => {
    setSecondsLeft(initialSeconds);
    setIsActive(true);
  };

  const format = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return { secondsLeft, isActive, reset, format };
}

export function VerifyAccountScreen() {
  const router = useRouter();
  const toast = useToast();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const countdown = useCountdown(300);

  const handleVerify = async () => {
    if (!otp) return;
    setLoading(true);
    try {
      await otpService.verifyEmail(email, otp);
      router.replace("/");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to verify OTP";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await otpService.sendVerificationOtp(email, "email-verification");
      countdown.reset();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send OTP";
      toast.error(errorMessage);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthScreenShell
      title="Verify Your Account"
      description={`Enter your OTP sent to ${email || "your email"} to verify your identity and continue securely.`}
    >
      <OtpCodeInput onChange={setOtp} value={otp} length={4} />

      <View style={styles.metaBlock}>
        <Text style={styles.timer}>{countdown.format()}</Text>
      </View>

      <AuthButton
        label={resending ? "Sending..." : "Send Again"}
        variant="secondary"
        onPress={handleResend}
        disabled={resending || loading || countdown.isActive}
      />
      <AuthButton
        label={loading ? "Verifying..." : "Verify"}
        onPress={handleVerify}
        disabled={loading || resending || otp.length < 4}
      />
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  metaBlock: {
    alignItems: "center",
  },
  timer: {
    color: authTheme.colors.textPrimary,
    fontSize: 28,
    fontWeight: "400",
    letterSpacing: 1,
  },
});