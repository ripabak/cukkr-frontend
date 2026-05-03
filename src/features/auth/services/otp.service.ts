import { authClient } from "@/src/lib/auth-client";

type OtpType = "email-verification" | "forget-password";

export const otpService = {
  async sendVerificationOtp(email: string, type: OtpType) {
    return authClient.emailOtp.sendVerificationOtp({ email, type });
  },

  async verifyEmail(email: string, otp: string) {
    return authClient.emailOtp.verifyEmail({ email, otp });
  },

  async resetPassword(email: string, otp: string, password: string) {
    return authClient.emailOtp.resetPassword({ email, otp, password });
  },
};
