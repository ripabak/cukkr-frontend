import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { authClient } from "@/src/lib/auth-client";

import { useToast } from "@/src/lib/providers";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { authTheme } from "../auth-theme";
import { AuthButton } from "../components/AuthButton";
import { AuthFooterPrompt } from "../components/AuthFooterPrompt";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";
import { useSignIn, useSendVerificationOtp } from "../hooks";
import { getErrorMessage } from "../utils/error-handler";
import { getUrlParam, resolveRedirect } from "../utils/redirect";

export function LoginScreen() {
  const { t } = useI18nContext();
  const router = useRouter();
  const toast = useToast();
  const {
    callbackURL: callbackURLParam,
  } = useLocalSearchParams<{ callbackURL?: string }>();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync: signIn, isPending: signingIn } = useSignIn();
  const { mutateAsync: sendOtp, isPending: sendingOtp } =
    useSendVerificationOtp();
  const isPending = signingIn || sendingOtp;

  // Sudah login? Langsung lanjut ke target redirect (handoff dari landing):
  // tanpa perlu submit form login lagi.
  const { data: session, isPending: sessionPending } = authClient.useSession();

  useEffect(() => {
    if (sessionPending || !session?.user) return;
    const raw = getUrlParam("callbackURL", callbackURLParam);
    if (!raw) return; // belum ada param → tunggu render berikutnya
    const target = resolveRedirect(raw);
    router.replace(target ?? "/d/(tabs)/home");
  }, [session, sessionPending, callbackURLParam, router]);

  const handleLogin = async () => {
    if (!identifier || !password) return;

    try {
      const callbackURL = getUrlParam("callbackURL", callbackURLParam);
      // Better Auth membawa target redirect sendiri (callbackURL) dan
      // mengembalikannya sebagai `data.url` — kita tinggal navigasi ke sana.
      const data = await signIn({
        email: identifier,
        password,
        callbackURL,
      });
      const target = resolveRedirect(data?.url ?? callbackURL);
      router.replace(target ?? "/d/(tabs)/home");
    } catch (error) {
      if (
        error instanceof Error &&
        (error as any).code === "EMAIL_NOT_VERIFIED"
      ) {
        sendOtp({ email: identifier, type: "email-verification" });
        router.replace({
          pathname: "/d/verify-account",
          params: {
            email: identifier,
            ...(callbackURLParam ? { callbackURL: callbackURLParam } : {}),
          },
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
              params: callbackURLParam ? { callbackURL: callbackURLParam } : {},
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
              params: callbackURLParam ? { callbackURL: callbackURLParam } : {},
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
    fontWeight: "500",
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
