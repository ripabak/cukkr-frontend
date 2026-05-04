import { useRouter } from "expo-router";
import { useState } from "react";

import { useToast } from "@/src/lib/providers";
import { AuthButton } from "../components/AuthButton";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";
import { otpService } from "../services";
import { isValidEmail } from "../utils/validation";

export function ForgotPasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      await otpService.sendVerificationOtp(email, "forget-password");
      router.push({
        pathname: "/verify-otp",
        params: { email, isPasswordReset: "true" },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset OTP";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenShell
      title="Forgot Password"
      description="Enter your email address to receive a code to reset your password and regain access to your account."
    >
      <AuthTextField
        autoCapitalize="none"
        keyboardType="email-address"
        label="Email Address*"
        onChangeText={setEmail}
        placeholder="Email address*"
        value={email}
      />

      <AuthButton
        label={loading ? "Sending..." : "Continue"}
        onPress={handleContinue}
        disabled={loading || !email.trim()}
      />
    </AuthScreenShell>
  );
}