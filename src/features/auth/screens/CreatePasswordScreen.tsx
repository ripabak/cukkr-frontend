import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import { useToast } from "@/src/lib/providers";
import { AuthButton } from "../components/AuthButton";
import { AuthFooterPrompt } from "../components/AuthFooterPrompt";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";
import { otpService } from "../services";
import { isValidPassword, passwordsMatch } from "../utils/validation";

const MIN_PASSWORD_LENGTH = 8;

export function CreatePasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const { email, otp } = useLocalSearchParams<{
    email: string;
    otp: string;
  }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!isValidPassword(password, MIN_PASSWORD_LENGTH)) {
      toast.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
      return;
    }

    if (!passwordsMatch(password, confirmPassword)) {
      toast.error("Passwords do not match");
      return;
    }

    if (!email || !otp) {
      toast.error("Missing email or OTP. Please try again.");
      return;
    }

    setLoading(true);
    try {
      await otpService.resetPassword(email, otp, password);
      toast.success("Password reset successfully");
      router.replace("/login");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to reset password";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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