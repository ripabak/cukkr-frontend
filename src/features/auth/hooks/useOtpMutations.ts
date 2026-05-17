import { useMutation } from "@tanstack/react-query";
import { otpService } from "../services";

type OtpType = "email-verification" | "forget-password";

export function useSendVerificationOtp() {
  return useMutation({
    mutationFn: ({ email, type }: { email: string; type: OtpType }) =>
      otpService.sendVerificationOtp(email, type),
  });
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      otpService.verifyEmail(email, otp),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: ({
      email,
      otp,
      password,
    }: {
      email: string;
      otp: string;
      password: string;
    }) => otpService.resetPassword(email, otp, password),
  });
}
