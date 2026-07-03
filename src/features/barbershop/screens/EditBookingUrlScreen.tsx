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
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export function EditBookingUrlScreen() {
  const router = useRouter();
  const toast = useToast();

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
        text: "Only letters, numbers, and hyphens between words.",
        color: "#FF3B30",
      };
    if (isTyping) return { text: "Checking availability...", color: "#FF9500" };
    if (isCheckingSlug)
      return { text: "Checking availability...", color: "#FF9500" };
    if (isAvailable === true) return { text: "Available ✓", color: "#34C759" };
    if (isAvailable === false)
      return { text: "Slug not available", color: "#FF3B30" };
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
          toast.success("Booking URL updated");
          router.back();
        },
        onError: (error) => {
          toast.error(error.message || "Failed to update booking URL");
        },
      },
    );
  };

  return (
    <ScreenShell
      headerSlot={
        <EditFieldHeader
          title="Book Url"
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
            placeholder="your-barbershop"
            value={slug}
            onChangeText={setSlug}
            editable={isOwner}
          />
          {slugFeedback && (
            <Text style={[styles.slugFeedback, { color: slugFeedback.color }]}>
              {slugFeedback.text}
            </Text>
          )}
          <HelperCopy
            lines={[
              "This is your public booking link that customers use to make appointments.",
              "Use only letters, numbers, and hyphens.",
            ]}
            errorLine={
              isChanged && !isValidSlug
                ? "Only letters, numbers, and hyphens between words."
                : undefined
            }
            style={styles.helper}
          />
          {!isOwner && (
            <View style={styles.viewOnlyBanner}>
              <Text style={styles.viewOnlyText}>Only the barbershop owner can edit the booking URL</Text>
            </View>
          )}
        </>
      )}
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
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
