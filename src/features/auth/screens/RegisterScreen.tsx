import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import { useToast } from "@/src/lib/providers";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { AuthButton } from "../components/AuthButton";
import { AuthFooterPrompt } from "../components/AuthFooterPrompt";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";
import { useSignUp, useSendVerificationOtp } from "../hooks";
import { getErrorMessage } from "../utils/error-handler";
import {
  validateEmail,
  validatePassword,
  validatePasswordsMatch,
} from "../utils/validation";

const MIN_PASSWORD_LENGTH = 8;

export function RegisterScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18nContext();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { mutateAsync: signUp, isPending: signingUp } = useSignUp();
  const { mutateAsync: sendOtp, isPending: sendingOtp } =
    useSendVerificationOtp();
  const isPending = signingUp || sendingOtp;

  const handleRegister = async () => {
    if (!name || !identifier || !password || !confirmPassword) return;

    const emailResult = validateEmail(identifier);
    if (!emailResult.isValid) {
      toast.error(t(emailResult.message));
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

    try {
      await signUp({ name, email: identifier, password });
      await sendOtp({ email: identifier, type: "email-verification" });
      router.push({
        pathname: "/d/verify-account",
        params: { email: identifier, ...(redirect ? { redirect } : {}) },
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AuthScreenShell
      title={t("auth.registerTitle")}
      description={t("auth.registerDescription")}
      footer={
        <AuthFooterPrompt
          prompt={t("auth.signInInstead")}
          actionLabel={t("auth.login")}
          onPress={() =>
            router.push({
              pathname: "/d/login",
              params: redirect ? { redirect } : {},
            })
          }
        />
      }
    >
      <AuthTextField
        autoCapitalize="words"
        label={t("auth.name")}
        onChangeText={setName}
        placeholder={t("auth.name")}
        value={name}
      />

      <AuthTextField
        autoCapitalize="none"
        keyboardType="email-address"
        label={t("auth.email")}
        onChangeText={setIdentifier}
        placeholder={t("auth.email")}
        value={identifier}
      />

      <AuthTextField
        label={t("auth.password")}
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
        label={isPending ? t("common.saving") : t("auth.register")}
        onPress={handleRegister}
        disabled={isPending}
      />
    </AuthScreenShell>
  );
}
