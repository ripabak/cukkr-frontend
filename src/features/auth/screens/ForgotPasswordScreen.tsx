import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { authClient } from "@/src/lib/auth-client";
import { AuthButton } from "../components/AuthButton";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    setLoading(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "forget-password",
    });
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message || "Failed to send reset OTP");
      return;
    }

    router.push({
      pathname: "/verify-otp",
      params: { email, isPasswordReset: "true" },
    });
  };

  return (
    <AuthScreenShell
      title="Forgot Password"
      description="Enter your email address to receive a code to reset your password and regain access to your account."
    >
      <AuthTextField
        autoCapitalize="none"
        keyboardType="email-address"
        label="Email Address*"
        onChangeText={setEmail}
        placeholder="Email address*"
        value={email}
      />

      <AuthButton
        label={loading ? "Sending..." : "Continue"}
        onPress={handleContinue}
        disabled={loading || !email.trim()}
      />
    </AuthScreenShell>
  );
}