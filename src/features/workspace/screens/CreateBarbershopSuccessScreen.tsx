import { Colors } from "@/src/theme/colors";
import { GradientButton } from "@/src/features/workspace/components/GradientButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useCreateBarbershopForm } from "../context/CreateBarbershopContext";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { AppText } from "@/src/components/AppText";

export function CreateBarbershopSuccessScreen() {
  const router = useRouter();
  const { t } = useI18nContext();
  const { formData, resetFormData } = useCreateBarbershopForm();
  const barbershopName = formData.name || t("createBarbershop.yourBarbershop");

  const handleOpenBarbershop = () => {
    resetFormData();
    router.replace("/d/home");
  };

  return (
    <ScreenShell
      contentStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 32,
      }}
    >
      <AppText style={styles.title}>{t("common.success")}</AppText>
      <AppText style={styles.subtitle}>
        {`${t("createBarbershop.successMessage")} "${barbershopName}"`}
      </AppText>
      <GradientButton
        label={t("common.done")}
        style={styles.button}
        onPress={handleOpenBarbershop}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.text.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 12,
  },
  button: {
    marginTop: 48,
  },
});
