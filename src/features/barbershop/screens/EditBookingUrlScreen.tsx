import { EditFieldHeader } from "@/src/components/EditFieldHeader";
import { HelperCopy } from "@/src/components/HelperCopy";
import { ScreenShell } from "@/src/components/ScreenShell";
import { TextInputField } from "@/src/components/TextInputField";
import {
  useBarbershopCurrent,
  useBarbershopSlugCheck,
  useUpdateBarbershopSettings,
} from "@/src/features/barbershop/hooks";
import { useDebounce, useMemberRole } from "@/src/hooks";
import { useToast } from "@/src/lib/providers";
import { Colors } from "@/src/theme/colors";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";

export function EditBookingUrlScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18nContext();

  const { data: barbershop, isLoading: isFetching } = useBarbershopCurrent();
  const { mutate: updateSettings, isPending: isSaving } =
    useUpdateBarbershopSettings();
  const { role } = useMemberRole();
  const isOwner = role === "owner";

  const [slug, setSlug] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (barbershop && !initialized) {
      setSlug(barbershop.slug ?? "");
      setInitialized(true);
    }
  }, [barbershop, initialized]);

  const debouncedSlug = useDebounce(slug);

  const isChanged = initialized && slug !== (barbershop?.slug ?? "");
  const isDebouncedChanged =
    initialized && debouncedSlug !== (barbershop?.slug ?? "");
  const isValidSlug = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(slug);
  const isTyping = slug !== debouncedSlug;

  const { data: isAvailable, isLoading: isCheckingSlug } =
    useBarbershopSlugCheck(
      isDebouncedChanged && isValidSlug ? debouncedSlug : "",
    );

  const slugFeedback = useMemo(() => {
    if (!isChanged) return null;
    if (!isValidSlug)
      return {
        text: t("barbershop.slugLabel"),
        color: Colors.status.danger,
      };
    if (isTyping) return { text: t("common.loading"), color: Colors.status.warning };
    if (isCheckingSlug)
      return { text: t("common.loading"), color: Colors.status.warning };
    if (isAvailable === true) return { text: t("common.success"), color: Colors.status.success };
    if (isAvailable === false)
      return { text: t("common.error"), color: Colors.status.danger };
    return null;
  }, [isChanged, isValidSlug, isTyping, isCheckingSlug, isAvailable]);

  const canSave =
    !isSaving &&
    isValidSlug &&
    !isTyping &&
    slug.trim().length > 0 &&
    (!isChanged || isAvailable === true);

  const handleSave = () => {
    if (!canSave) return;

    updateSettings(
      { slug: slug.trim() },
      {
        onSuccess: () => {
          toast.success(t("toast.updateSuccess"));
          router.back();
        },
        onError: (error) => {
          toast.error(error.message || t("toast.unknownError"));
        },
      },
    );
  };

  return (
    <ScreenShell
      hideAppHeader
      headerSlot={
        <EditFieldHeader
          title={t("barbershop.slugLabel")}
          onBack={() => router.back()}
          onSave={canSave ? handleSave : undefined}
          hideSave={!isOwner}
        />
      }
      contentStyle={styles.content}
    >
      {isFetching && !initialized ? (
        <ActivityIndicator
          size="small"
          color={Colors.brand.primary}
          style={styles.loader}
        />
      ) : (
        <>
          <TextInputField
            label="https://cukkr.com/"
            placeholder={t("barbershop.slugLabel")}
            value={slug}
            onChangeText={setSlug}
            editable={isOwner}
          />
          {slugFeedback && (
            <AppText style={[styles.slugFeedback, { color: slugFeedback.color }]}>
              {slugFeedback.text}
            </AppText>
          )}
          <HelperCopy
            lines={[
              t("barbershop.urlHelper1"),
              t("barbershop.urlHelper2"),
            ]}
            errorLine={
              isChanged && !isValidSlug
                ? t("barbershop.slugLabel")
                : undefined
            }
            style={styles.helper}
          />
          {!isOwner && (
            <View style={styles.viewOnlyBanner}>
              <AppText style={styles.viewOnlyText}>{t("common.noPermission")}</AppText>
            </View>
          )}
        </>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 24,
    paddingBottom: 200,
  },
  loader: {
    marginTop: 20,
  },
  slugFeedback: {
    fontSize: 12,
    marginTop: 6,
  },
  helper: {
    marginTop: 16,
  },
  viewOnlyBanner: {
    marginTop: 24,
    padding: 12,
    backgroundColor: Colors.bg.surface,
    borderRadius: 8,
    alignItems: "center",
  },
  viewOnlyText: {
    fontSize: 13,
    color: Colors.text.muted,
    textAlign: "center",
  },
});
