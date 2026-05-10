import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useToast } from "@/src/lib/providers";
import { authTheme } from "../auth-theme";
import { AuthButton } from "../components/AuthButton";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { OtpCodeInput } from "../components/OtpCodeInput";
import { useCountdown, useSendVerificationOtp } from "../hooks";
import { getErrorMessage } from "../utils/error-handler";

// This screen is used exclusively in the forgot-password flow.
// OTP is not verified here — it's passed to CreatePasswordScreen
// and verified server-side when resetPassword is called.
export function VerifyOtpScreen() {
  const router = useRouter();
  const toast = useToast();
  const { email } = useLocalSearchParams<{ email: string }>();
  const [otp, setOtp] = useState("");
  const countdown = useCountdown(300);
  const { mutateAsync: sendOtp, isPending: resending } = useSendVerificationOtp();

  const handleResend = async () => {
    if (!email) return;
    try {
      await sendOtp({ email, type: "forget-password" });
      countdown.reset();
      toast.success("OTP sent successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleContinue = () => {
    if (otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }

    router.push({
      pathname: "/create-password",
      params: { email, otp },
    });
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
