import { useRouter } from "expo-router";
import { useState } from "react";

import { useToast } from "@/src/lib/providers";
import { AuthButton } from "../components/AuthButton";
import { AuthFooterPrompt } from "../components/AuthFooterPrompt";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";
import { useSignUp, useSendVerificationOtp } from "../hooks";
import { getErrorMessage } from "../utils/error-handler";
import { validateEmail, validatePassword, validatePasswordsMatch } from "../utils/validation";

const MIN_PASSWORD_LENGTH = 8;

export function RegisterScreen() {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { mutateAsync: signUp, isPending: signingUp } = useSignUp();
  const { mutateAsync: sendOtp, isPending: sendingOtp } = useSendVerificationOtp();
  const isPending = signingUp || sendingOtp;

  const handleRegister = async () => {
    if (!name || !identifier || !password || !confirmPassword) return;

    const emailResult = validateEmail(identifier);
    if (!emailResult.isValid) {
      toast.error(emailResult.message);
      return;
    }

    const passwordResult = validatePassword(password, MIN_PASSWORD_LENGTH);
    if (!passwordResult.isValid) {
      toast.error(passwordResult.message);
      return;
    }

    const matchResult = validatePasswordsMatch(password, confirmPassword);
    if (!matchResult.isValid) {
      toast.error(matchResult.message);
      return;
    }

    try {
      await signUp({ name, email: identifier, password });
      await sendOtp({ email: identifier, type: "email-verification" });
      router.push({
        pathname: "/verify-account",
        params: { email: identifier },
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
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
        label={isPending ? "Creating Account..." : "Create Account"}
        onPress={handleRegister}
        disabled={isPending}
      />
    </AuthScreenShell>
  );
}
