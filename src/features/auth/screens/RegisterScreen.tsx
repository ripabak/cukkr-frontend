import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { authClient } from "@/src/lib/auth-client";
import { AuthButton } from "../components/AuthButton";
import { AuthFooterPrompt } from "../components/AuthFooterPrompt";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";

export function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !identifier || !password || !confirmPassword) return;
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    const { data, error } = await authClient.signUp.email({
      name,
      email: identifier,
      password,
    });

    if (error) {
      setLoading(false);
      Alert.alert("Error", error.message || "Failed to register");
      return;
    }

    const { error: sendError } = await authClient.emailOtp.sendVerificationOtp({
      email: identifier,
      type: "email-verification",
    });
    setLoading(false);

    if (sendError) {
      Alert.alert("Error", sendError.message || "Failed to send OTP");
      return;
    }

    router.push({
      pathname: "/verify-account",
      params: { email: identifier },
    });
  };

  return (
    <AuthScreenShell
      title="Create Account"
      description="Create a new account to get started and enjoy accessing our features."
      footer={
        <AuthFooterPrompt
          actionLabel="Sign In here"
          href="/login"
          prompt="Already have an account?"
        />
      }
    >
      <AuthTextField
        autoCapitalize="words"
        label="Name"
        onChangeText={setName}
        placeholder="Name"
        value={name}
      />

      <AuthTextField
        autoCapitalize="none"
        keyboardType="email-address"
        label="Email / Phone Number*"
        onChangeText={setIdentifier}
        placeholder="Email / Phone number*"
        value={identifier}
      />

      <AuthTextField
        label="Password"
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        secureToggle
        value={password}
      />

      <AuthTextField
        label="Confirm Password"
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        secureTextEntry
        secureToggle
        value={confirmPassword}
      />

      <AuthButton
        label={loading ? "Creating Account..." : "Create Account"}
        onPress={handleRegister}
        disabled={loading}
      />
    </AuthScreenShell>
  );
}