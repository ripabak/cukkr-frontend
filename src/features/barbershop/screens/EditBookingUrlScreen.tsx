import { EditFieldHeader } from "@/src/components/EditFieldHeader";
import { HelperCopy } from "@/src/components/HelperCopy";
import { PrefixedInputField } from "@/src/components/PrefixedInputField";
import {
  useBarbershopCurrent,
  useBarbershopSlugCheck,
  useUpdateBarbershopSettings,
} from "@/src/features/barbershop/hooks";
import { useToast } from "@/src/lib/providers";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function EditBookingUrlScreen() {
  const router = useRouter();
  const toast = useToast();

  const { data: barbershop, isLoading: isFetching } = useBarbershopCurrent();
  const { mutate: updateSettings, isPending: isSaving } =
    useUpdateBarbershopSettings();

  const [slug, setSlug] = useState("");
  const [debouncedSlug, setDebouncedSlug] = useState("");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (barbershop && !initialized) {
      setSlug(barbershop.slug ?? "");
      setDebouncedSlug(barbershop.slug ?? "");
      setInitialized(true);
    }
  }, [barbershop, initialized]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSlug(slug), 500);
    return () => clearTimeout(timer);
  }, [slug]);

  const isChanged = initialized && slug !== (barbershop?.slug ?? "");
  const isDebouncedChanged = initialized && debouncedSlug !== (barbershop?.slug ?? "");
  const isValidSlug = /^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$/.test(slug);
  const isTyping = slug !== debouncedSlug;

  const { data: isAvailable, isLoading: isCheckingSlug } =
    useBarbershopSlugCheck(isDebouncedChanged && isValidSlug ? debouncedSlug : "");

  const slugFeedback = useMemo(() => {
    if (!isChanged) return null;
    if (!isValidSlug) return { text: "Only letters, numbers, and hyphens between words.", color: "#FF3B30" };
    if (isTyping) return { text: "Checking availability...", color: "#FF9500" };
    if (isCheckingSlug) return { text: "Checking availability...", color: "#FF9500" };
    if (isAvailable === true)
      return { text: "Available ✓", color: "#34C759" };
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

    updateSettings({ slug: slug.trim() }, {
      onSuccess: () => {
        toast.success("Booking URL updated");
        router.back();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update booking URL");
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        <EditFieldHeader
          title="Book Url"
          onBack={() => router.back()}
          onSave={canSave ? handleSave : undefined}
        />
        <View style={styles.content}>
          {isFetching && !initialized ? (
            <ActivityIndicator
              size="small"
              color="#C6FF4D"
              style={styles.loader}
            />
          ) : (
            <>
              <PrefixedInputField
                prefix="https://cukkr.com/"
                value={slug}
                onChangeText={setSlug}
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
                errorLine={isChanged && !isValidSlug ? "Only letters, numbers, and hyphens between words." : undefined}
                style={styles.helper}
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EEEEE0",
  },
  outer: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
});
