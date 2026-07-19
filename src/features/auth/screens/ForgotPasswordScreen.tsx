import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useToast } from "@/src/lib/providers";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { Colors } from "@/src/theme/colors";
import { AuthButton } from "../components/AuthButton";
import { AuthScreenShell } from "../components/AuthScreenShell";
import { AuthTextField } from "../components/AuthTextField";
import { useSendVerificationOtp } from "../hooks";
import { getErrorMessage } from "../utils/error-handler";
import { validateEmail } from "../utils/validation";

export function ForgotPasswordScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18nContext();
  const insets = useSafeAreaInsets();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const [email, setEmail] = useState("");
  const { mutateAsync: sendOtp, isPending } = useSendVerificationOtp();

  const handleContinue = async () => {
    if (!email.trim()) {
      toast.error(t("auth.emailRequired"));
      return;
    }

    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      toast.error(t(emailResult.message));
      return;
    }

    try {
      await sendOtp({ email, type: "forget-password" });
      router.push({
        pathname: "/d/verify-otp",
        params: { email, ...(redirect ? { redirect } : {}) },
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.backBtn, { top: insets.top + 12 }]}
      >
        <Ionicons name="chevron-back" size={24} color={Colors.text.primary} />
      </TouchableOpacity>
      <AuthScreenShell
        title={t("auth.forgotPasswordTitle")}
        description={t("auth.forgotPasswordDescription")}
      >
        <AuthTextField
          autoCapitalize="none"
          keyboardType="email-address"
          label={t("auth.email")}
          onChangeText={setEmail}
          placeholder={t("auth.email")}
          value={email}
        />

        <AuthButton
          label={isPending ? t("common.saving") : t("common.next")}
          onPress={handleContinue}
          disabled={isPending || !email.trim()}
        />
      </AuthScreenShell>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backBtn: {
    position: "absolute",
    left: 16,
    zIndex: 10,
    padding: 8,
  },
});
