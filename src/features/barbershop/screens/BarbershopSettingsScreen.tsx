import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { InfoRow } from "@/src/components/InfoRow";
import { ScreenShell } from "@/src/components/ScreenShell";
import { DangerButton } from "@/src/features/barbershop/components/DangerButton";
import { OperationRow } from "@/src/features/barbershop/components/OperationRow";
import {
  useBarbershopCurrent,
  useDeleteBarbershop,
  useLeaveBarbershop,
} from "@/src/features/barbershop/hooks";
import { useMemberRole } from "@/src/hooks";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useToast } from "@/src/lib/providers";
import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import { AppText } from "@/src/components/AppText";

export function BarbershopSettingsScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18nContext();
  const { data: barbershop, isLoading } = useBarbershopCurrent();
  const { role } = useMemberRole();
  const isOwner = role === "owner";
  const { mutate: leave, isPending: isLeaving } = useLeaveBarbershop();
  const { mutate: deleteBarbershop, isPending: isDeleting } =
    useDeleteBarbershop();
  const isPending = isLeaving || isDeleting;
  const [showActionModal, setShowActionModal] = useState(false);

  const handleActionConfirm = () => {
    if (!barbershop?.id) return;
    if (isOwner) {
      deleteBarbershop(barbershop.id, {
        onSuccess: () => {
          setShowActionModal(false);
          toast.success(t("toast.deleteSuccess"));
          router.replace("/");
        },
        onError: (error) => {
          setShowActionModal(false);
          toast.error(error.message || t("toast.unknownError"));
        },
      });
    } else {
      leave(barbershop.id, {
        onSuccess: () => {
          setShowActionModal(false);
          toast.success("Left barbershop");
          router.replace("/");
        },
        onError: (error) => {
          setShowActionModal(false);
          toast.error(error.message || t("toast.unknownError"));
        },
      });
    }
  };

  const handleCameraBadge = () => {
    Alert.alert(t("barbershop.logoUpload"), "Logo upload will be available soon.");
  };

  return (
    <ScreenShell contentStyle={styles.scrollContentPadding} hideAppHeader>
      <View style={styles.titleRow}>
        <AppText style={styles.title}>{t("barbershop.settings")}</AppText>
      </View>
      <AppText style={styles.subtitle}>Setup based on your barbershop needs</AppText>

      <View style={styles.avatarWrapper}>
        {barbershop?.logoUrl ? (
          <Image
            source={{ uri: barbershop.logoUrl }}
            style={styles.avatarCircle}
            contentFit="cover"
          />
        ) : (
          <View style={styles.avatar}>
            <AppText style={styles.avatarInitials}>
              {barbershop?.name
                ? barbershop.name
                    .split(" ")
                    .slice(0, 2)
                    .filter(Boolean)
                    .map((w: string) => w[0].toUpperCase())
                    .join("")
                : "?"}
            </AppText>
          </View>
        )}
        <TouchableOpacity
          style={styles.editAvatarBtn}
          onPress={isLoading ? undefined : handleCameraBadge}
          activeOpacity={0.8}
        >
          <Ionicons
            name="camera-outline"
            size={14}
            color={Colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      <AppText style={styles.sectionLabel}>Information</AppText>
      <View style={styles.card}>
        <InfoRow
          label={t("barbershop.nameLabel")}
          value={barbershop?.name}
          placeholder={t("barbershop.nameLabel")}
          onPress={
            isLoading
              ? undefined
              : () =>
                  router.push({
                    pathname: "/d/edit-barbershop-info",
                    params: { mode: "name" },
                  })
          }
        />
        <InfoRow
          label="Description"
          value={barbershop?.description!}
          placeholder="Description"
          onPress={
            isLoading
              ? undefined
              : () =>
                  router.push({
                    pathname: "/d/edit-barbershop-info",
                    params: { mode: "description" },
                  })
          }
        />
        <InfoRow
          label={t("barbershop.addressLabel")}
          value={barbershop?.address!}
          placeholder={t("barbershop.addressLabel")}
          isLast
          onPress={
            isLoading
              ? undefined
              : () =>
                  router.push({
                    pathname: "/d/edit-barbershop-info",
                    params: { mode: "address" },
                  })
          }
        />
      </View>

      <AppText style={[styles.sectionLabel, styles.sectionLabelTop]}>
        Booking Web
      </AppText>
      <View style={styles.card}>
        <InfoRow
          label="Book Url"
          value={
            barbershop?.slug
              ? `${process.env.EXPO_PUBLIC_WEB_URL}/${barbershop.slug}`
              : undefined
          }
          placeholder="—"
          isLast
          onPress={
            isLoading ? undefined : () => router.push("/d/edit-booking-url")
          }
        />
      </View>

      <AppText style={[styles.sectionLabel, styles.sectionLabelTop]}>
        Operations
      </AppText>
      <View style={styles.card}>
        <OperationRow
          label={t("barbers.title")}
          onPress={
            isLoading ? undefined : () => router.push("/d/barbers-management")
          }
        />
        <OperationRow
          label={t("customers.title")}
          onPress={
            isLoading ? undefined : () => router.push("/d/customer-management")
          }
        />
        <OperationRow
          label={t("services.title")}
          onPress={
            isLoading ? undefined : () => router.push("/d/services-management")
          }
        />
        <OperationRow
          label={t("barbershop.openHours")}
          isLast
          onPress={isLoading ? undefined : () => router.push("/d/open-hours")}
        />
      </View>

      <AppText style={[styles.sectionLabel, styles.sectionLabelTop]}>
        {isOwner ? "Delete Barbershop" : "Leave Barbershop"}
      </AppText>
      <DangerButton
        label={isOwner ? "Delete This Barbershop" : "Leave This Barbershop"}
        onPress={isLoading ? undefined : () => setShowActionModal(true)}
        style={styles.dangerBtn}
      />

      <ConfirmationModal
        visible={showActionModal}
        title={isOwner ? "Delete Barbershop" : "Leave Barbershop"}
        description={
          isOwner
            ? "Are you sure you want to delete this barbershop? This action cannot be undone."
            : "Are you sure you want to leave this barbershop?"
        }
        confirmLabel={
          isPending
            ? isOwner
              ? "Deleting..."
              : "Leaving..."
            : isOwner
              ? "Delete"
              : "Leave"
        }
        cancelLabel={t("common.cancel")}
        onConfirm={handleActionConfirm}
        onCancel={() => setShowActionModal(false)}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    gap: 4,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.text.primary,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 6,
    marginBottom: 24,
  },
  avatarWrapper: {
    alignSelf: "center",
    marginBottom: 24,
    position: "relative",
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.bg.surface,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.brand.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 28,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 1,
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: -6,
    right: -6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.bg.default,
    borderWidth: 1,
    borderColor: Colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.secondary,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionLabelTop: {
    marginTop: 24,
  },
  card: {
    backgroundColor: Colors.bg.default,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border.light,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    elevation: 2,
  },
  dangerBtn: {
    marginTop: 16,
  },
  scrollContentPadding: {
    paddingBottom: 200,
  },
});
