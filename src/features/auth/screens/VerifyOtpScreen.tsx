import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";

import { useToast } from "@/src/lib/providers";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { authTheme } from "../auth-theme";
import { AuthButton } from "../components/AuthButton";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { OtpCodeInput } from "../components/OtpCodeInput";
import { useCountdown, useSendVerificationOtp } from "../hooks";
import { getErrorMessage } from "../utils/error-handler";

// This screen is used exclusively in the forgot-password flow.
// OTP is not verified here — it's passed to CreatePasswordScreen
// and verified server-side when resetPassword is called.
export function VerifyOtpScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18nContext();
  const { email, redirect } = useLocalSearchParams<{
    email: string;
    redirect?: string;
  }>();
  const [otp, setOtp] = useState("");
  const countdown = useCountdown(300);
  const { mutateAsync: sendOtp, isPending: resending } =
    useSendVerificationOtp();

  const handleResend = async () => {
    if (!email) return;
    try {
      await sendOtp({ email, type: "forget-password" });
      countdown.reset();
      toast.success(t("auth.otpSent"));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleContinue = () => {
    if (otp.length < 4) {
      toast.error(t("common.error"));
      return;
    }

    router.push({
      pathname: "/d/create-password",
      params: { email, otp, ...(redirect ? { redirect } : {}) },
    });
  };

  return (
    <AuthScreenShell
      title={t("auth.verifyOtp")}
      description={t("auth.verifyOtpDescription", { email: email || t("auth.email") })}
    >
      <OtpCodeInput onChange={setOtp} value={otp} length={4} />

      <View style={styles.metaBlock}>
        <AppText style={styles.timer}>{countdown.format()}</AppText>
      </View>

      <AuthButton
        label={resending ? t("common.saving") : t("auth.resendOtp")}
        variant="secondary"
        onPress={handleResend}
        disabled={resending || countdown.isActive}
      />
      <AuthButton
        label={t("common.next")}
        onPress={handleContinue}
        disabled={otp.length < 4}
      />
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  metaBlock: {
    alignItems: "center",
  },
  timer: {
    color: authTheme.colors.textPrimary,
    fontSize: 28,
    fontWeight: "400",
    letterSpacing: 1,
  },
});
