import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import { useToast } from "@/src/lib/providers";
import { useI18nContext } from "@/src/lib/i18n/provider";
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
  const { t } = useI18nContext();
  const { email, otp, redirect } = useLocalSearchParams<{
    email: string;
    otp: string;
    redirect?: string;
  }>();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const handleContinue = async () => {
    if (!password || !confirmPassword) {
      toast.error(t("common.error"));
      return;
    }

    const passwordResult = validatePassword(password, MIN_PASSWORD_LENGTH);
    if (!passwordResult.isValid) {
      toast.error(t(passwordResult.message, passwordResult.params));
      return;
    }

    const matchResult = validatePasswordsMatch(password, confirmPassword);
    if (!matchResult.isValid) {
      toast.error(t(matchResult.message));
      return;
    }

    if (!email || !otp) {
      toast.error(t("common.error"));
      return;
    }

    try {
      await resetPassword({ email, otp, password });
      toast.success(t("auth.passwordReset"));
      router.replace({
        pathname: "/d/login",
        params: redirect ? { redirect } : {},
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const isFormValid =
    password && confirmPassword && password === confirmPassword;

  return (
    <AuthScreenShell
      title={t("auth.createPasswordTitle")}
      description={t("auth.createPasswordDescription")}
      footer={
        <AuthFooterPrompt
          prompt={t("auth.rememberPassword")}
          actionLabel={t("auth.login")}
          onPress={() =>
            router.replace({
              pathname: "/d/login",
              params: redirect ? { redirect } : {},
            })
          }
        />
      }
    >
      <AuthTextField
        label={t("auth.createPassword")}
        onChangeText={setPassword}
        placeholder={t("auth.password")}
        secureTextEntry
        secureToggle
        value={password}
      />

      <AuthTextField
        label={t("auth.confirmPassword")}
        onChangeText={setConfirmPassword}
        placeholder={t("auth.confirmPassword")}
        secureTextEntry
        secureToggle
        value={confirmPassword}
      />

      <AuthButton
        label={isPending ? t("common.saving") : t("auth.createPassword")}
        onPress={handleContinue}
        disabled={isPending || !isFormValid}
      />
    </AuthScreenShell>
  );
}
