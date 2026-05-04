import { useRouter } from "expo-router";
import { useState } from "react";

import { useToast } from "@/src/lib/providers";
import { authService, otpService } from "../services";
import { AuthButton } from "../components/AuthButton";
import { AuthFooterPrompt } from "../components/AuthFooterPrompt";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";
import { passwordsMatch } from "../utils/validation";

export function RegisterScreen() {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !identifier || !password || !confirmPassword) return;
    if (!passwordsMatch(password, confirmPassword)) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      // Sign up user
      await authService.signUp(name, identifier, password);

      // Send verification OTP
      await otpService.sendVerificationOtp(identifier, "email-verification");

      // Navigate to OTP verification
      router.push({
        pathname: "/verify-account",
        params: { email: identifier },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to register";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
        label={isLoading ? "Creating Account..." : "Create Account"}
        onPress={handleRegister}
        disabled={isLoading}
      />
    </AuthScreenShell>
  );
}