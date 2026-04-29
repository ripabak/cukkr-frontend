import { useRouter } from "expo-router";
import { useState } from "react";

import { AuthButton } from "../components/AuthButton";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";

export function ForgotPasswordScreen() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");

  return (
    <AuthScreenShell
      title="Forgot Password"
      description="Enter your email address to receive a reset link and regain access to your account."
    >
      <AuthTextField
        autoCapitalize="none"
        keyboardType="email-address"
        label="Email / Phone Number*"
        onChangeText={setIdentifier}
        placeholder="Email / Phone number*"
        value={identifier}
      />

      <AuthButton label="Continue" onPress={() => router.push("/verify-otp")} />
    </AuthScreenShell>
  );
}