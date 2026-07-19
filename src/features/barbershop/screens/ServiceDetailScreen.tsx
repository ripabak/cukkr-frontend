import { Permission } from "@/src/components/Permission";
import { useMemberRole } from "@/src/hooks";
import { Colors } from "@/src/theme/colors";
import AppTheme from "@/src/app-theme";
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
} from "@/src/features/barbershop/hooks";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useToast } from "@/src/lib/providers";
import { Ionicons } from "@expo/vector-icons";
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
                activeOpacity={0.7}
                style={styles.overflowBtn}
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
            <View style={styles.serviceImage}>
              {canManage && (
                <View style={styles.cameraBadge}>
                  <Ionicons name="camera" size={14} color={Colors.text.primary} />
                </View>
              )}
            </View>
          </View>

          <AppText style={styles.sectionLabel}>{t("services.management")}</AppText>
          <View style={styles.card}>
            <InfoRow label={t("services.serviceName")} value={service?.name ?? "—"} />
            <InfoRow
              label="Description"
              value={service?.description ?? "—"}
              isLast
            />
          </View>

          <AppText style={[styles.sectionLabel, styles.sectionLabelTop]}>
            {t("services.price")} & {t("services.duration")}
          </AppText>
          <View style={styles.card}>
            <InfoRow
              label={t("services.duration")}
              value={service ? `${service.duration} minutes` : "—"}
            />
            <InfoRow
              label={t("services.price")}
              value={service ? formatPrice(service.price) : "—"}
            />
            <InfoRow
              label={t("services.discount")}
              value={service ? `${service.discount}%` : "—"}
              isLast
            />
          </View>

          <Permission roles={["owner", "admin"]}>
            <AppText style={[styles.sectionLabel, styles.sectionLabelTop]}>
              {t("services.active")}
            </AppText>
            <AppText style={styles.operationalSubtitle}>
              {t("services.toggleActive")}
            </AppText>
            <View style={styles.card}>
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
                  label: t("services.editService"),
                  onPress: () => {
                    setOverflowVisible(false);
                    router.push({
                      pathname: "/d/add-or-edit-service",
                      params: { serviceId, isEdit: "true" },
                    });
                  },
                },
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
    paddingTop: AppTheme.spacing.lg,
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
    backgroundColor: Colors.brand.primary,
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
    marginBottom: 20,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: Colors.bg.surface,
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.brand.primary,
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
    fontWeight: "700",
    fontSize: 14,
    color: Colors.text.primary,
  },
});
