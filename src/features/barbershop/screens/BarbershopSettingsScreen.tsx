import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { InfoRow } from "@/src/components/InfoRow";
import { ScreenShell } from "@/src/components/ScreenShell";
import { DangerButton } from "@/src/features/barbershop/components/DangerButton";
import { OperationRow } from "@/src/features/barbershop/components/OperationRow";
import {
  useBarbershopCurrent,
  useDeleteBarbershop,
  useLeaveBarbershop,
  useUploadLogo,
} from "@/src/features/barbershop/hooks";
import { useImagePicker, useMemberRole } from "@/src/hooks";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useToast } from "@/src/lib/providers";
import { Colors } from "@/src/theme/colors";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
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

  const { pickAndGetFile, isPicking } = useImagePicker();
  const { mutate: uploadLogo, isPending: isUploading } = useUploadLogo();

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
          toast.success(t("barbershop.leftSuccess"));
          router.replace("/");
        },
        onError: (error) => {
          setShowActionModal(false);
          toast.error(error.message || t("toast.unknownError"));
        },
      });
    }
  };

  const handleCameraBadge = async () => {
    const file = await pickAndGetFile();
    if (!file) return;

    uploadLogo(file, {
      onSuccess: () => {
        toast.success(t("toast.logoUploadSuccess"));
      },
      onError: (e) => {
        const message = e.message;
        if (message.startsWith("MAX_SIZE_EXCEEDED:")) {
          const size = message.split(":")[1];
          toast.error(t("toast.imageTooLarge", { size }));
        } else {
          toast.error(e.message || t("toast.unknownError"));
        }
      },
    });
  };

  return (
    <ScreenShell contentStyle={styles.scrollContentPadding} hideAppHeader>
      <View style={styles.titleRow}>
        <AppText style={styles.title}>{t("barbershop.settings")}</AppText>
      </View>
      <AppText style={styles.subtitle}>{t("barbershop.setupSubtitle")}</AppText>

      <View style={styles.avatarWrapper}>
        <TouchableOpacity
          onPress={
            isLoading || isPicking || isUploading
              ? undefined
              : handleCameraBadge
          }
          activeOpacity={0.8}
        >
          {barbershop?.logoUrl ? (
            <Image
              source={{ uri: barbershop.logoUrl }}
              style={[styles.avatarCircle, styles.clickableBorder]}
              contentFit="cover"
            />
          ) : (
            <View style={[styles.avatar, styles.clickableBorder]}>
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
        </TouchableOpacity>
      </View>

      <AppText style={styles.sectionLabel}>{t("barbershop.information")}</AppText>
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
          label={t("barbershop.description")}
          value={barbershop?.description!}
          placeholder={t("barbershop.description")}
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
        {t("barbershop.bookingWeb")}
      </AppText>
      <View style={styles.card}>
        <InfoRow
          label={t("barbershop.bookUrl")}
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
        {t("barbershop.operations")}
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
        {isOwner ? t("barbershop.deleteBarbershop") : t("barbershop.leaveBarbershop")}
      </AppText>
      <DangerButton
        label={isOwner ? t("barbershop.deleteThis") : t("barbershop.leaveThis")}
        onPress={isLoading ? undefined : () => setShowActionModal(true)}
        style={styles.dangerBtn}
      />

      <ConfirmationModal
        visible={showActionModal}
        title={isOwner ? t("barbershop.deleteBarbershop") : t("barbershop.leaveBarbershop")}
        description={
          isOwner
            ? t("barbershop.deleteConfirmDesc")
            : t("barbershop.leaveConfirmDesc")
        }
        confirmLabel={
          isPending
            ? isOwner
              ? t("barbershop.deleting")
              : t("barbershop.leaving")
            : isOwner
              ? t("barbershop.delete")
              : t("barbershop.leave")
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
  clickableBorder: {
    borderWidth: 1.5,
    borderColor: Colors.border.default,
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
