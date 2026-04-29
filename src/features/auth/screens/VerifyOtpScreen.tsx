import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { authTheme } from "../auth-theme";
import { AuthButton } from "../components/AuthButton";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { OtpCodeInput } from "../components/OtpCodeInput";

export function VerifyOtpScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  return (
    <AuthScreenShell
      title="Verify Your OTP"
      description="Enter your OTP sent to your email or phone number to verify your identity and continue securely."
    >
      <OtpCodeInput onChange={setOtp} value={otp} />

      <View style={styles.metaBlock}>
        <Text style={styles.timer}>05:00</Text>
      </View>

      <AuthButton label="Send Again" variant="secondary" />
      <AuthButton label="Continue" onPress={() => router.push("/create-password")} />
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