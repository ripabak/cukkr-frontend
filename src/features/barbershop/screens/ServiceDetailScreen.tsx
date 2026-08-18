import { Permission } from "@/src/components/Permission";
import { useImagePicker, useMemberRole } from "@/src/hooks";
import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { InfoRow } from "@/src/components/InfoRow";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { OperationRow } from "@/src/features/barbershop/components/OperationRow";
import { OverflowMenu } from "@/src/components/OverflowMenu";
import { StatusBadge } from "@/src/components/StatusBadge";
import { ToggleRow } from "@/src/features/barbershop/components/ToggleRow";
import {
  useDeleteService,
  useServiceById,
  useSetServiceDefault,
  useToggleServiceActive,
  useUploadServiceImage,
} from "@/src/features/barbershop/hooks";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useToast } from "@/src/lib/providers";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { AppText } from "@/src/components/AppText";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function formatPrice(amount: number): string {
  return `Rp ${amount.toLocaleString("id-ID")}`;
}

export function ServiceDetailScreen() {
  const router = useRouter();
  const toast = useToast();
  const { t } = useI18nContext();
  const { role } = useMemberRole();
  const canManage = role === "owner" || role === "admin";
  const { serviceId = "" } = useLocalSearchParams<{ serviceId?: string }>();

  const { data: service, isLoading } = useServiceById(serviceId);
  const { mutate: toggleActive } = useToggleServiceActive();
  const { mutate: setDefault, isPending: isSettingDefault } =
    useSetServiceDefault();
  const { mutate: deleteService, isPending: isDeleting } = useDeleteService();

  const { pickAndGetFile } = useImagePicker();
  const { mutate: uploadImage, isPending: isUploadingImage } =
    useUploadServiceImage(serviceId);

  const [overflowVisible, setOverflowVisible] = useState(false);
  const [showSetDefaultModal, setShowSetDefaultModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleToggleActive = () => {
    toggleActive(serviceId, {
      onError: (e) => toast.error(e.message || t("toast.unknownError")),
    });
  };

  const handleSetDefault = () => {
    setDefault(serviceId, {
      onSuccess: () => {
        toast.success(t("toast.updateSuccess"));
        setShowSetDefaultModal(false);
      },
      onError: (e) => {
        toast.error(e.message || t("toast.unknownError"));
        setShowSetDefaultModal(false);
      },
    });
  };

  const handleDelete = () => {
    deleteService(serviceId, {
      onSuccess: () => {
        toast.success(t("toast.deleteSuccess"));
        router.back();
      },
      onError: (e) => {
        toast.error(e.message || t("toast.unknownError"));
        setShowDeleteModal(false);
      },
    });
  };

  const handleEditField = (mode: string) => {
    router.push({
      pathname: "/d/edit-service-info",
      params: { serviceId, mode },
    });
  };

  const handleImageUpload = async () => {
    const file = await pickAndGetFile();
    if (!file) return;

    uploadImage(file, {
      onSuccess: () => {
        toast.success(t("toast.imageUploadSuccess"));
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator
          size="large"
          color={Colors.brand.primary}
          style={styles.loader}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.outer}>
        <ScreenHeader
          onBack={() => router.back()}
          rightAction={
            <Permission roles={["owner", "admin"]}>
                <TouchableOpacity
                  onPress={() => setOverflowVisible(true)}
                  activeOpacity={0.85}
                  style={[styles.overflowBtn, Neu.accent()]}
                >
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={18}
                    color={Colors.text.primary}
                  />
                </TouchableOpacity>
            </Permission>
          }
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageWrapper}>
            <TouchableOpacity
              onPress={
                canManage && !isUploadingImage
                  ? handleImageUpload
                  : undefined
              }
              activeOpacity={canManage ? 0.85 : 1}
              style={[styles.imageBox, Neu.raised(Colors.bg.surface)]}
            >
              {service?.imageMed ? (
                <Image
                  source={{ uri: service.imageMed }}
                  style={styles.serviceImageContent}
                  contentFit="cover"
                />
              ) : (
                <View style={styles.serviceImagePlaceholder}>
                  <Ionicons
                    name="camera-outline"
                    size={24}
                    color={
                      canManage ? Colors.icon.muted : Colors.border.default
                    }
                  />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <AppText style={styles.sectionLabel}>{t("services.management")}</AppText>
          <View style={[styles.card, Neu.raised(Colors.bg.surface)]}>
            <InfoRow
              label={t("services.serviceName")}
              value={service?.name ?? "—"}
              onPress={canManage ? () => handleEditField("name") : undefined}
              showChevron={canManage}
            />
            <InfoRow
              label="Description"
              value={service?.description ?? "—"}
              onPress={canManage ? () => handleEditField("description") : undefined}
              showChevron={canManage}
              isLast
            />
          </View>

          <AppText style={[styles.sectionLabel, styles.sectionLabelTop]}>
            {t("services.price")} & {t("services.duration")}
          </AppText>
          <View style={[styles.card, Neu.raised(Colors.bg.surface)]}>
            <InfoRow
              label={t("services.duration")}
              value={service ? `${service.duration} minutes` : "—"}
              onPress={canManage ? () => handleEditField("duration") : undefined}
              showChevron={canManage}
            />
            <InfoRow
              label={t("services.price")}
              value={service ? formatPrice(service.price) : "—"}
              onPress={canManage ? () => handleEditField("price") : undefined}
              showChevron={canManage}
            />
            <InfoRow
              label={t("services.discount")}
              value={service ? `${service.discount}%` : "—"}
              onPress={canManage ? () => handleEditField("discount") : undefined}
              showChevron={canManage}
              isLast
            />
          </View>

          <Permission roles={["owner", "admin"]}>
            <AppText style={[styles.sectionLabel, styles.sectionLabelTop]}>
              {t("services.operational")}
            </AppText>
            <View style={[styles.card, Neu.raised(Colors.bg.surface)]}>
              <ToggleRow
                label={t("services.active")}
                value={service?.isActive ?? false}
                onValueChange={handleToggleActive}
              />
              {service?.isDefault ? (
                <View style={styles.defaultRow}>
                  <AppText style={styles.defaultLabel}>{t("services.setDefault")}</AppText>
                  <StatusBadge label={t("services.defaultService")} variant="default" />
                </View>
              ) : (
                <OperationRow
                  label={t("services.setDefault")}
                  onPress={() => setShowSetDefaultModal(true)}
                  isLast
                />
              )}
            </View>
          </Permission>
        </ScrollView>

        {overflowVisible && (
          <View style={styles.overflowOverlay}>
            <OverflowMenu
              visible
              items={[
                {
                  label: t("common.delete"),
                  danger: true,
                  onPress: () => {
                    setOverflowVisible(false);
                    setShowDeleteModal(true);
                  },
                },
              ]}
              onClose={() => setOverflowVisible(false)}
            />
          </View>
        )}

        <ConfirmationModal
          visible={showSetDefaultModal}
          icon="checkmark-circle-outline"
          title={t("services.setDefault")}
          description={t("services.defaultService")}
          confirmLabel={isSettingDefault ? t("common.saving") : t("services.setDefault")}
          cancelLabel={t("common.cancel")}
          onConfirm={handleSetDefault}
          onCancel={() => setShowSetDefaultModal(false)}
        />

        <ConfirmationModal
          visible={showDeleteModal}
          icon="trash-outline"
          title={t("common.delete")}
          description={t("services.deleteConfirm")}
          confirmLabel={isDeleting ? t("common.saving") : t("common.delete")}
          cancelLabel={t("common.cancel")}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg.default,
  },
  outer: {
    flex: 1,
  },
  loader: {
    marginTop: 80,
  },
  overflowBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 200,
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  imageBox: {
    borderRadius: 22,
    padding: 6,
  },
  serviceImageContent: {
    width: 88,
    height: 88,
    borderRadius: 16,
  },
  serviceImagePlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 16,
    backgroundColor: Colors.bg.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.text.secondary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  sectionLabelTop: {
    marginTop: 24,
  },
  card: {
    borderRadius: 20,
    overflow: "hidden",
  },
  operationalSubtitle: {
    fontSize: 12,
    color: Colors.text.muted,
    marginBottom: 8,
  },
  overflowOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  defaultRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  defaultLabel: {
    flex: 1,
    fontWeight: "600",
    fontSize: 14,
    color: Colors.text.primary,
  },
});
