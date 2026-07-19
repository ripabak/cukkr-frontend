import { Colors } from "@/src/theme/colors";
import AppTheme from "@/src/app-theme";
import { HelperCopy } from "@/src/components/HelperCopy";
import { IconActionButton } from "@/src/features/barbershop/components/IconActionButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { TextInputField } from "@/src/components/TextInputField";
import { useInviteBarber } from "@/src/features/barbershop/hooks";
import { validateEmail } from "@/src/features/barbershop/utils/form-validators";
import { useMemberRole } from "@/src/hooks";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useToast } from "@/src/lib/providers";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { SafeAreaView } from "react-native-safe-area-context";

export function InviteBarberScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18nContext();
  const { role } = useMemberRole();
  const canInvite = role === "owner" || role === "admin";
  const [contact, setContact] = useState("");
  const { mutate: invite, isPending } = useInviteBarber();

  const handleSend = () => {
    const email = contact.trim();
    const validation = validateEmail(email);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    invite(email, {
      onSuccess: () => {
        toast.success(t("toast.inviteSent"));
        router.back();
      },
      onError: (e) => {
        toast.error(e.message || t("toast.unknownError"));
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScreenHeader
          title={t("barbers.inviteBarber")}
          onBack={() => router.back()}
          rightAction={
            canInvite ? (
              <IconActionButton
                iconName="paper-plane-outline"
                onPress={isPending ? undefined : handleSend}
                size={40}
              />
            ) : undefined
          }
        />

        <View style={styles.content}>
          <TextInputField
            label={t("auth.email")}
            placeholder={t("barbers.inviteViaEmail")}
            value={contact}
            onChangeText={setContact}
            keyboardType="email-address"
            editable={canInvite}
          />
          <HelperCopy
            lines={[
              t("barbers.inviteHelper1"),
              t("barbers.inviteHelper2"),
            ]}
          />
          {!canInvite && (
            <View style={styles.viewOnlyBanner}>
              <AppText style={styles.viewOnlyText}>{t("common.noPermission")}</AppText>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg.default,
    paddingTop: AppTheme.spacing.lg,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  viewOnlyBanner: {
    marginTop: 24,
    padding: 12,
    backgroundColor: Colors.bg.surface,
    borderRadius: 12,
    alignItems: "center",
  },
  viewOnlyText: {
    fontSize: 13,
    color: Colors.text.muted,
    textAlign: "center",
  },
});
