import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useToast } from "@/src/lib/providers";
import { authTheme } from "../auth-theme";
import { AuthButton } from "../components/AuthButton";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { OtpCodeInput } from "../components/OtpCodeInput";
import { useCountdown, useVerifyEmail, useSendVerificationOtp } from "../hooks";
import { getErrorMessage } from "../utils/error-handler";

export function VerifyAccountScreen() {
  const router = useRouter();
  const toast = useToast();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const countdown = useCountdown(300);
  const { mutateAsync: verifyEmail, isPending: verifying } = useVerifyEmail();
  const { mutateAsync: sendOtp, isPending: resending } = useSendVerificationOtp();

  const handleVerify = async () => {
    if (!otp) return;
    try {
      await verifyEmail({ email, otp });
      router.replace("/(tabs)/home");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await sendOtp({ email, type: "email-verification" });
      countdown.reset();
      toast.success("OTP sent successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
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
        disabled={resending || verifying || countdown.isActive}
      />
      <AuthButton
        label={verifying ? "Verifying..." : "Verify"}
        onPress={handleVerify}
        disabled={verifying || resending || otp.length < 4}
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
