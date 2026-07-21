import { EditFieldHeader } from "@/src/components/EditFieldHeader";
import { HelperCopy } from "@/src/components/HelperCopy";
import { ScreenShell } from "@/src/components/ScreenShell";
import { TextInputField } from "@/src/components/TextInputField";
import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import {
  useBarbershopCurrent,
  useBarbershopSlugCheck,
  useUpdateBarbershopSettings,
} from "@/src/features/barbershop/hooks";
import { useDebounce, useMemberRole } from "@/src/hooks";
import { useToast } from "@/src/lib/providers";
import { Colors } from "@/src/theme/colors";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { formatDateTime } from "@/src/utils/date";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";

const BASE_URL = "cukkr.com/";
const MIN_SLUG_LENGTH = 3;
const SLUG_COOLDOWN_HOURS = 72;

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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    if (barbershop && !initialized) {
      setSlug(barbershop.slug ?? "");
      setInitialized(true);
    }
  }, [barbershop, initialized]);

  const lastSlugChangedAt = barbershop?.lastSlugChangedAt
    ? new Date(barbershop.lastSlugChangedAt)
    : null;

  const cooldownEnd = lastSlugChangedAt
    ? new Date(lastSlugChangedAt.getTime() + SLUG_COOLDOWN_HOURS * 60 * 60 * 1000)
    : null;

  const isCooldownActive = cooldownEnd ? new Date() < cooldownEnd : false;

  const sanitizeSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9-]/g, "");
  };

  const debouncedSlug = useDebounce(slug);

  const isChanged = initialized && slug !== (barbershop?.slug ?? "");
  const isDebouncedChanged =
    initialized && debouncedSlug !== (barbershop?.slug ?? "");
  const isValidSlug = /^[a-z0-9]+(-[a-z0-9]+)*$/.test(debouncedSlug);
  const hasMinLength = debouncedSlug.length >= MIN_SLUG_LENGTH;
  const isTyping = slug !== debouncedSlug;

  const { data: isAvailable, isLoading: isCheckingSlug } =
    useBarbershopSlugCheck(
      isDebouncedChanged && isValidSlug && hasMinLength ? debouncedSlug : "",
    );

  const slugFeedback = useMemo(() => {
    if (!isChanged && !debouncedSlug) return null;
    if (!isChanged) return null;
    if (debouncedSlug.length === 0) return null;

    const url = BASE_URL + debouncedSlug;

    if (!hasMinLength && debouncedSlug.length > 0) {
      return {
        text: t("barbershop.slugMinLength"),
        color: Colors.status.danger,
      };
    }
    if (!isValidSlug) {
      return {
        text: t("barbershop.slugInvalid"),
        color: Colors.status.danger,
      };
    }
    if (isTyping || isCheckingSlug) {
      return {
        text: t("barbershop.slugChecking", { url }),
        color: Colors.status.warning,
      };
    }
    if (isAvailable === true) {
      return {
        text: t("barbershop.slugAvailable", { url }),
        color: Colors.status.success,
      };
    }
    if (isAvailable === false) {
      return {
        text: t("barbershop.slugUnavailable", { url }),
        color: Colors.status.danger,
      };
    }
    return null;
  }, [isChanged, debouncedSlug, isValidSlug, hasMinLength, isTyping, isCheckingSlug, isAvailable, t]);

  const canSave =
    !isSaving &&
    initialized &&
    isChanged &&
    isValidSlug &&
    hasMinLength &&
    !isTyping &&
    isAvailable === true &&
    !isCooldownActive;

  const handleSavePress = () => {
    if (isCooldownActive) {
      setShowRejectModal(true);
      return;
    }
    setShowConfirmModal(true);
  };

  const handleSave = () => {
    if (!canSave) return;
    setShowConfirmModal(false);

    updateSettings(
      { slug: debouncedSlug },
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
          onSave={canSave ? handleSavePress : undefined}
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
            label={"https://" + BASE_URL}
            placeholder={t("barbershop.slugLabel")}
            value={slug}
            onChangeText={(text) => setSlug(sanitizeSlug(text))}
            editable={isOwner && !isCooldownActive}
            autoCapitalize="none"
            autoCorrect={false}
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
            style={styles.helper}
          />
          {isCooldownActive && cooldownEnd && (
            <AppText style={styles.cooldownInfo}>
              {t("barbershop.urlCooldownLabel", {
                date: formatDateTime(cooldownEnd),
              })}
            </AppText>
          )}
          {!isOwner && (
            <View style={styles.viewOnlyBanner}>
              <AppText style={styles.viewOnlyText}>{t("common.noPermission")}</AppText>
            </View>
          )}
        </>
      )}
      <ConfirmationModal
        visible={showConfirmModal}
        title={t("barbershop.urlCooldownConfirmTitle")}
        description={t("barbershop.urlCooldownConfirmDesc")}
        confirmLabel={t("common.save")}
        cancelLabel={t("common.cancel")}
        onConfirm={handleSave}
        onCancel={() => setShowConfirmModal(false)}
      />
      <ConfirmationModal
        visible={showRejectModal}
        title={t("barbershop.urlCooldownActiveTitle")}
        description={t("barbershop.urlCooldownActiveDesc", {
          date: cooldownEnd ? formatDateTime(cooldownEnd) : "",
        })}
        confirmLabel={t("common.ok")}
        onConfirm={() => setShowRejectModal(false)}
      />
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
    fontSize: 13,
    marginTop: 6,
  },
  helper: {
    marginTop: 8,
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
  cooldownInfo: {
    fontSize: 13,
    color: Colors.status.warning,
    marginTop: 12,
  },
});
