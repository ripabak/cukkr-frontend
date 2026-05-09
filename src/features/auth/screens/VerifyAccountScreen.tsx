import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { authClient } from "@/src/lib/auth-client";
import { AuthButton } from "../components/AuthButton";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { OtpCodeInput } from "../components/OtpCodeInput";

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
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const countdown = useCountdown(300);

  const handleVerify = async () => {
    if (!otp) return;
    setLoading(true);
    const { error } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message || "Failed to verify OTP");
      return;
    }

    router.replace("/");
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    });
    setResending(false);

    if (error) {
      Alert.alert("Error", error.message || "Failed to send OTP");
    } else {
      countdown.reset();
      Alert.alert("Success", "OTP sent successfully");
    }
  };

  return (
    <AuthScreenShell
      title="Verify Your Account"
      description={`Enter your OTP sent to ${email || "your email"} to verify your identity and continue securely.`}
    >
      <OtpCodeInput onChange={setOtp} value={otp} length={4} />

      <View className="items-center">
        <Text className="text-[#2F3A2F] text-[28px] tracking-[1px]">{countdown.format()}</Text>
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