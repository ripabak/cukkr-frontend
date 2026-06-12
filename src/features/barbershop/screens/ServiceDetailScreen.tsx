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
import { useToast } from "@/src/lib/providers";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
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
      onError: (e) => toast.error(e.message || "Failed to toggle service"),
    });
  };

  const handleSetDefault = () => {
    setDefault(serviceId, {
      onSuccess: () => {
        toast.success("Default service updated");
        setShowSetDefaultModal(false);
      },
      onError: (e) => {
        toast.error(e.message || "Failed to set default");
        setShowSetDefaultModal(false);
      },
    });
  };

  const handleDelete = () => {
    deleteService(serviceId, {
      onSuccess: () => {
        toast.success("Service deleted");
        router.back();
      },
      onError: (e) => {
        toast.error(e.message || "Failed to delete service");
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
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={14} color={Colors.text.primary} />
              </View>
            </View>
          </View>

          <Text style={styles.sectionLabel}>General Information</Text>
          <View style={styles.card}>
            <InfoRow label="Name" value={service?.name ?? "—"} />
            <InfoRow
              label="Description"
              value={service?.description ?? "—"}
              isLast
            />
          </View>

          <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>
            Pricing & Duration
          </Text>
          <View style={styles.card}>
            <InfoRow
              label="Duration"
              value={service ? `${service.duration} minutes` : "—"}
            />
            <InfoRow
              label="Price"
              value={service ? formatPrice(service.price) : "—"}
            />
            <InfoRow
              label="Discount"
              value={service ? `${service.discount}%` : "—"}
              isLast
            />
          </View>

          <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>
            Operational Details
          </Text>
          <Text style={styles.operationalSubtitle}>
            Toggle activation and configure default service settings.
          </Text>
          <Permission roles={["owner", "admin"]}>
            <View style={styles.card}>
              <ToggleRow
                label="Active"
                value={service?.isActive ?? false}
                onValueChange={handleToggleActive}
              />
              {service?.isDefault ? (
                <View style={styles.defaultRow}>
                  <Text style={styles.defaultLabel}>Set As Default</Text>
                  <StatusBadge label="Default" variant="default" />
                </View>
              ) : (
                <OperationRow
                  label="Set As Default"
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
                  label: "Edit Service",
                  onPress: () => {
                    setOverflowVisible(false);
                    router.push({
                      pathname: "/d/add-or-edit-service",
                      params: { serviceId, isEdit: "true" },
                    });
                  },
                },
                {
                  label: "Delete this Service",
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
          title="Set as Default Service"
          description="This service will become the default for your barbershop."
          confirmLabel={isSettingDefault ? "Setting..." : "Set Default"}
          cancelLabel="Cancel"
          onConfirm={handleSetDefault}
          onCancel={() => setShowSetDefaultModal(false)}
        />

        <ConfirmationModal
          visible={showDeleteModal}
          icon="trash-outline"
          title="Delete Service"
          description={`Delete "${service?.name}"? This cannot be undone.`}
          confirmLabel={isDeleting ? "Deleting..." : "Delete"}
          cancelLabel="Cancel"
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
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  imageWrapper: {
    alignItems: "center",
    marginBottom: 20,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
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
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  sectionLabelTop: {
    marginTop: 16,
  },
  card: {
    backgroundColor: Colors.bg.default,
    borderRadius: 16,
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
    paddingVertical: 14,
  },
  defaultLabel: {
    flex: 1,
    fontWeight: "700",
    fontSize: 14,
    color: Colors.text.primary,
  },
});
