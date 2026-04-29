import { useRouter } from "expo-router";
import { useState } from "react";

import { AuthButton } from "../components/AuthButton";
import { AuthFooterPrompt } from "../components/AuthFooterPrompt";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";

export function CreatePasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <AuthScreenShell
      title="Create New Password"
      description="Enter your new password."
      footer={
        <AuthFooterPrompt
          actionLabel="Sign In here"
          href="/login"
          prompt="Return to authentication?"
        />
      }
    >
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

      <AuthButton label="Continue" onPress={() => router.replace("/login")} />
    </AuthScreenShell>
  );
}