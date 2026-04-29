import { useRouter } from "expo-router";
import { useState } from "react";

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

      <AuthButton label="Create Account" onPress={() => router.push("/verify-account")} />
    </AuthScreenShell>
  );
}