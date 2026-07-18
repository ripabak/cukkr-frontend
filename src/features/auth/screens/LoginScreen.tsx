import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";

import { useToast } from "@/src/lib/providers";
import { authTheme } from "../auth-theme";
import { AuthButton } from "../components/AuthButton";
import { AuthFooterPrompt } from "../components/AuthFooterPrompt";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";
import { useSignIn, useSendVerificationOtp } from "../hooks";
import { getErrorMessage } from "../utils/error-handler";

export function LoginScreen() {
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
      title="Login"
      description="Enter your email and password to securely access your account and manage your services."
      footer={
        <AuthFooterPrompt
          prompt="Don't have an account?"
          actionLabel="Sign Up here"
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
        label="Email*"
        onChangeText={setIdentifier}
        placeholder="Email"
        value={identifier}
      />

      {/* <View style={styles.fontDemo}>
        <Text style={styles.fontDemoInter}>
          Inter - The quick brown fox jumps over the lazy dog
        </Text>
        <Text style={styles.fontDemoJakarta}>
          Plus Jakarta Sans - The quick brown fox jumps over the lazy dog
        </Text>
      </View> */}

      <AuthTextField
        label="Password"
        onChangeText={setPassword}
        placeholder="Password"
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
          <AppText style={styles.forgotPasswordLink}>Forgot Password</AppText>
        </Pressable>
      </View>

      <AuthButton
        label={isPending ? "Logging in..." : "Login"}
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
