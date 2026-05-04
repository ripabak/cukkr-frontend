import { useRouter } from "expo-router";
import { useState } from "react";

import { useToast } from "@/src/lib/providers";
import { AuthButton } from "../components/AuthButton";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";
import { useSendVerificationOtp } from "../hooks";
import { getErrorMessage } from "../utils/error-handler";
import { validateEmail } from "../utils/validation";

export function ForgotPasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const { mutateAsync: sendOtp, isPending } = useSendVerificationOtp();

  const handleContinue = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      toast.error(emailResult.message);
      return;
    }

    try {
      await sendOtp({ email, type: "forget-password" });
      router.push({
        pathname: "/verify-otp",
        params: { email, isPasswordReset: "true" },
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
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
        label={isPending ? "Sending..." : "Continue"}
        onPress={handleContinue}
        disabled={isPending || !email.trim()}
      />
    </AuthScreenShell>
  );
}
