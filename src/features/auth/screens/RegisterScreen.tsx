import { useRouter } from "expo-router";
import { useState } from "react";

import { useToast } from "@/src/lib/providers";
import { useSignUp } from "../hooks";
import { AuthButton } from "../components/AuthButton";
import { AuthFooterPrompt } from "../components/AuthFooterPrompt";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";
import { otpService } from "../services";
import { passwordsMatch } from "../utils/validation";

export function RegisterScreen() {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const { mutate: signUp, isPending } = useSignUp();

  const handleRegister = async () => {
    if (!name || !identifier || !password || !confirmPassword) return;
    if (!passwordsMatch(password, confirmPassword)) {
      toast.error("Passwords do not match");
      return;
    }

    signUp(
      { name, email: identifier, password },
      {
        onSuccess: async () => {
          setSendingOtp(true);
          try {
            const { error: sendError } = await otpService.sendVerificationOtp(
              identifier,
              "email-verification"
            );
            setSendingOtp(false);

            if (sendError) {
              toast.error(sendError.message || "Failed to send OTP");
              return;
            }

            router.push({
              pathname: "/verify-account",
              params: { email: identifier },
            });
          } catch (error) {
            setSendingOtp(false);
            toast.error("Failed to send OTP");
          }
        },
        onError: (error) => {
          toast.error(error.message || "Failed to register");
        },
      }
    );
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
        label={isPending || sendingOtp ? "Creating Account..." : "Create Account"}
        onPress={handleRegister}
        disabled={isPending || sendingOtp}
      />
    </AuthScreenShell>
  );
}