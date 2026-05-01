import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { authClient } from "@/src/lib/auth-client";
import { AuthButton } from "../components/AuthButton";
import { AuthFooterPrompt } from "../components/AuthFooterPrompt";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";

const MIN_PASSWORD_LENGTH = 8;

function isValidPassword(password: string): boolean {
  return password.length >= MIN_PASSWORD_LENGTH;
}

export function CreatePasswordScreen() {
  const router = useRouter();
  const { email, otp } = useLocalSearchParams<{
    email: string;
    otp: string;
  }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isValidPassword(password)) {
      Alert.alert("Error", `Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!email || !otp) {
      Alert.alert("Error", "Missing email or OTP. Please try again.");
      return;
    }

    setLoading(true);
    const { error } = await authClient.emailOtp.resetPassword({
      email,
      otp,
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Error", error.message || "Failed to reset password");
      return;
    }

    Alert.alert("Success", "Password reset successfully");
    router.replace("/login");
  };

  const isFormValid = password && confirmPassword && password === confirmPassword;

  return (
    <AuthScreenShell
      title="Create New Password"
      description="Enter a strong password to secure your account."
      footer={
        <AuthFooterPrompt
          actionLabel="Sign In here"
          href="/login"
          prompt="Remember your password?"
        />
      }
    >
      <AuthTextField
        label="New Password"
        onChangeText={setPassword}
        placeholder="At least 8 characters"
        secureTextEntry
        secureToggle
        value={password}
      />

      <AuthTextField
        label="Confirm Password"
        onChangeText={setConfirmPassword}
        placeholder="Confirm password"
        secureTextEntry
        secureToggle
        value={confirmPassword}
      />

      <AuthButton
        label={loading ? "Resetting..." : "Reset Password"}
        onPress={handleContinue}
        disabled={loading || !isFormValid}
      />
    </AuthScreenShell>
  );
}