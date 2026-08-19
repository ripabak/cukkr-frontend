import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "@/src/components/AppText";
import { Ionicons } from "@expo/vector-icons";
import { ThemePickerSheet } from "@/src/components/ThemePickerSheet";
import { authClient } from "@/src/lib/auth-client";

import { useToast } from "@/src/lib/providers";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
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
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const [showTheme, setShowTheme] = useState(false);
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
      toast.show({
        type: "error",
        title: t("auth.loginFailed"),
        description: getErrorMessage(error),
      });
    }
  };

  return (
    <View style={styles.root}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("profile.themeMode")}
        onPress={() => setShowTheme(true)}
        style={[styles.themeBtn, { top: insets.top + 10 }]}
      >
        <Ionicons
          name={isDark ? "sunny-outline" : "moon-outline"}
          size={20}
          color={colors.text.secondary}
        />
      </Pressable>

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
      <ThemePickerSheet
        visible={showTheme}
        onClose={() => setShowTheme(false)}
      />
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    themeBtn: {
      position: "absolute",
      right: 16,
      zIndex: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.bg.surface,
      borderWidth: 1,
      borderColor: c.border.light,
    },
    forgotPasswordRow: {
      alignItems: "flex-end",
      marginTop: -4,
    },
    forgotPasswordLink: {
      color: c.brand.primaryDark,
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
