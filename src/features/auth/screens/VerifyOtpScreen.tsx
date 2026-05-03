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

export function VerifyOtpScreen() {
  const router = useRouter();
  const toast = useToast();
  const { email, isPasswordReset } = useLocalSearchParams<{
    email: string;
    isPasswordReset?: string;
  }>();
  const [otp, setOtp] = useState("");
  const [resending, setResending] = useState(false);
  const countdown = useCountdown(300);

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    const { error } = await otpService.sendVerificationOtp(
      email,
      isPasswordReset === "true" ? "forget-password" : "email-verification"
    );
    setResending(false);

    if (error) {
      toast.error(error.message || "Failed to send OTP");
    } else {
      countdown.reset();
      toast.success("OTP sent successfully");
    }
  };

  const handleContinue = () => {
    if (otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }

    if (isPasswordReset === "true") {
      router.push({
        pathname: "/create-password",
        params: { email, otp },
      });
    } else {
      router.replace("/");
    }
  };

  return (
    <AuthScreenShell
      title="Verify Your Code"
      description={`Enter the code sent to ${email || "your email"} to proceed.`}
    >
      <OtpCodeInput onChange={setOtp} value={otp} length={4} />

      <View style={styles.metaBlock}>
        <Text style={styles.timer}>{countdown.format()}</Text>
      </View>

      <AuthButton
        label={resending ? "Sending..." : "Send Again"}
        variant="secondary"
        onPress={handleResend}
        disabled={resending || countdown.isActive}
      />
      <AuthButton
        label="Continue"
        onPress={handleContinue}
        disabled={otp.length < 4}
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