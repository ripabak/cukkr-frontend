import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";

import { useToast } from "@/src/lib/providers";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { authTheme } from "../auth-theme";
import { AuthButton } from "../components/AuthButton";
import { AuthFooterPrompt } from "../components/AuthFooterPrompt";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";
import { useSignIn, useSendVerificationOtp } from "../hooks";
import { getErrorMessage } from "../utils/error-handler";

export function LoginScreen() {
  const { t } = useI18nContext();
  const router = useRouter();
  const toast = useToast();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: signIn, isPending: signingIn } = useSignIn();
  const { mutateAsync: sendOtp, isPending: sendingOtp } =
    useSendVerificationOtp();
  const isPending = signingIn || sendingOtp;

  const handleLogin = async () => {
    if (!identifier || !password) return;

    try {
      await signIn({ email: identifier, password });
      router.replace((redirect as any) ?? "/d/(tabs)/home");
    } catch (error) {
      if (
        error instanceof Error &&
        (error as any).code === "EMAIL_NOT_VERIFIED"
      ) {
        sendOtp({ email: identifier, type: "email-verification" });
        router.replace({
          pathname: "/d/verify-account",
          params: { email: identifier },
        });
        return;
      }
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <AuthScreenShell
      title={t("auth.login")}
      description={t("auth.loginTitle")}
      footer={
        <AuthFooterPrompt
          prompt={t("auth.signUpInstead")}
          actionLabel={t("auth.register")}
          onPress={() =>
            router.push({
              pathname: "/d/register",
              params: redirect ? { redirect } : {},
            })
          }
        />
      }
    >
      <AuthTextField
        autoCapitalize="none"
        keyboardType="email-address"
        label={t("auth.email") + "*"}
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

      <View style={styles.forgotPasswordRow}>
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/d/forgot-password",
              params: redirect ? { redirect } : {},
            })
          }
        >
          <AppText style={styles.forgotPasswordLink}>{t("auth.forgotPassword")}</AppText>
        </Pressable>
      </View>

      <AuthButton
        label={isPending ? t("common.saving") : t("auth.login")}
        onPress={handleLogin}
        disabled={isPending}
      />
    </AuthScreenShell>
  );
}

const styles = StyleSheet.create({
  forgotPasswordRow: {
    alignItems: "flex-end",
    marginTop: -4,
  },
  forgotPasswordLink: {
    color: authTheme.colors.accentDark,
    fontSize: 13,
    fontWeight: "600",
  },
  fontDemo: {
    gap: 8,
    paddingVertical: 12,
  },
  fontDemoInter: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
  },
  fontDemoJakarta: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 16,
  },
});
