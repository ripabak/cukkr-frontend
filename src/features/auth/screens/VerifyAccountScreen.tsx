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
import { useCountdown, useVerifyEmail, useSendVerificationOtp } from "../hooks";
import { getErrorMessage } from "../utils/error-handler";

export function VerifyAccountScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18nContext();
  const { email, redirect } = useLocalSearchParams<{
    email: string;
    redirect?: string;
  }>();
  const [otp, setOtp] = useState("");
  const countdown = useCountdown(300);
  const { mutateAsync: verifyEmail, isPending: verifying } = useVerifyEmail();
  const { mutateAsync: sendOtp, isPending: resending } =
    useSendVerificationOtp();

  const handleVerify = async () => {
    if (!otp) return;
    try {
      await verifyEmail({ email, otp });
      router.replace((redirect as any) ?? "/d/(tabs)/home");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await sendOtp({ email, type: "email-verification" });
      countdown.reset();
      toast.success(t("auth.otpSent"));
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AuthScreenShell
      title={t("auth.verifyAccount")}
      description={t("auth.verifyAccountDescription", { email: email || t("auth.email") })}
    >
      <OtpCodeInput onChange={setOtp} value={otp} length={4} />

      <View style={styles.metaBlock}>
        <AppText style={styles.timer}>{countdown.format()}</AppText>
      </View>

      <AuthButton
        label={resending ? t("common.saving") : t("auth.resendOtp")}
        variant="secondary"
        onPress={handleResend}
        disabled={resending || verifying || countdown.isActive}
      />
      <AuthButton
        label={verifying ? t("common.saving") : t("auth.verifyOtp")}
        onPress={handleVerify}
        disabled={verifying || resending || otp.length < 4}
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
