import { authClient } from "@/src/lib/auth-client";

type OtpType = "email-verification" | "forget-password";

export const otpService = {
  async sendVerificationOtp(email: string, type: OtpType) {
    const { data, error } = await authClient.emailOtp.sendVerificationOtp({ email, type });

    if (error) {
      throw new Error(error.message || "Failed to send OTP");
    }

    return data;
  },

  async verifyEmail(email: string, otp: string) {
    const { data, error } = await authClient.emailOtp.verifyEmail({ email, otp });

    if (error) {
      throw new Error(error.message || "Failed to verify email");
    }

    return data;
  },

  async resetPassword(email: string, otp: string, password: string) {
    const { data, error } = await authClient.emailOtp.resetPassword({ email, otp, password });

    if (error) {
      throw new Error(error.message || "Failed to reset password");
    }

    return data;
  },
};
