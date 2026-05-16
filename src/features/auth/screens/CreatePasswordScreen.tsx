import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import { useToast } from "@/src/lib/providers";
import { AuthButton } from "../components/AuthButton";
import { AuthFooterPrompt } from "../components/AuthFooterPrompt";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";
import { useResetPassword } from "../hooks";
import { getErrorMessage } from "../utils/error-handler";
import { validatePassword, validatePasswordsMatch } from "../utils/validation";

const MIN_PASSWORD_LENGTH = 8;

export function CreatePasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const { email, otp } = useLocalSearchParams<{ email: string; otp: string }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const handleContinue = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
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

    if (!email || !otp) {
      toast.error("Missing email or OTP. Please try again.");
      return;
    }

    try {
      await resetPassword({ email, otp, password });
      toast.success("Password reset successfully");
      router.replace("/d/login");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const isFormValid = password && confirmPassword && password === confirmPassword;

  return (
    <AuthScreenShell
      title="Create New Password"
      description="Enter a strong password to secure your account."
      footer={
        <AuthFooterPrompt
          actionLabel="Sign In here"
          href="/d/login"
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
        label={isPending ? "Resetting..." : "Reset Password"}
        onPress={handleContinue}
        disabled={isPending || !isFormValid}
      />
    </AuthScreenShell>
  );
}
