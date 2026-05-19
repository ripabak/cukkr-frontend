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
import { useMyOrgRole } from "@/src/features/home/hooks/useHomeDashboardQueries";
import { useToast } from "@/src/lib/providers";
import { Colors } from '@/src/theme/colors';
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export function BarbershopSettingsScreen() {
  const router = useRouter();
  const toast = useToast();
  const { data: barbershop, isLoading } = useBarbershopCurrent();
  const { data: activeMember } = useMyOrgRole();
  const isOwner = activeMember?.role === "owner";
  const { mutate: leave, isPending: isLeaving } = useLeaveBarbershop();
  const { mutate: deleteBarbershop, isPending: isDeleting } = useDeleteBarbershop();
  const isPending = isLeaving || isDeleting;
  const [showActionModal, setShowActionModal] = useState(false);

  const handleActionConfirm = () => {
    if (!barbershop?.id) return;
    if (isOwner) {
      deleteBarbershop(barbershop.id, {
        onSuccess: () => {
          setShowActionModal(false);
          toast.success("Barbershop deleted");
          router.replace("/");
        },
        onError: (error) => {
          setShowActionModal(false);
          toast.error(error.message || "Failed to delete barbershop");
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
          toast.error(error.message || "Failed to leave barbershop");
        },
      });
    }
  };

  const handleCameraBadge = () => {
    Alert.alert("Logo Upload", "Logo upload will be available soon.");
  };

  return (
    <ScreenShell
      contentStyle={styles.scrollContentPadding}
    >
      <View style={styles.titleRow}>
        <Text style={styles.title}>Barbershop Settings</Text>
      </View>
      <Text style={styles.subtitle}>Setup based on your barbershop needs</Text>

      <View style={styles.avatarWrapper}>
        {barbershop?.logoUrl ? (
          <Image
            source={{ uri: barbershop.logoUrl }}
            style={styles.avatarCircle}
            contentFit="cover"
          />
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarInitials}>
              {barbershop?.name
                ? barbershop.name.split(" ").slice(0, 2).map((w: string) => w[0].toUpperCase()).join("")
                : "?"}
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.editAvatarBtn} onPress={isLoading ? undefined : handleCameraBadge} activeOpacity={0.8}>
          <Ionicons name="camera-outline" size={14} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>Information</Text>
      <View style={styles.card}>
        <InfoRow
          label="Name"
          value={barbershop?.name}
          placeholder="Name"
          onPress={isLoading ? undefined : () =>
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
          onPress={isLoading ? undefined : () =>
            router.push({
              pathname: "/d/edit-barbershop-info",
              params: { mode: "description" },
            })
          }
        />
        <InfoRow
          label="Address"
          value={barbershop?.address!}
          placeholder="Address"
          isLast
          onPress={isLoading ? undefined : () =>
            router.push({
              pathname: "/d/edit-barbershop-info",
              params: { mode: "address" },
            })
          }
        />
      </View>

      <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>
        Booking Web
      </Text>
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
          onPress={isLoading ? undefined : () => router.push("/d/edit-booking-url")}
        />
      </View>

      <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>
        Operations
      </Text>
      <View style={styles.card}>
        <OperationRow
          label="Barbers"
          onPress={isLoading ? undefined : () => router.push("/d/barbers-management")}
        />
        <OperationRow
          label="Customers"
          onPress={isLoading ? undefined : () => router.push("/d/customer-management")}
        />
        <OperationRow
          label="Services"
          onPress={isLoading ? undefined : () => router.push("/d/services-management")}
        />
        <OperationRow
          label="Open Hours"
          isLast
          onPress={isLoading ? undefined : () => router.push("/d/open-hours")}
        />
      </View>

      <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>
        {isOwner ? "Delete Barbershop" : "Leave Barbershop"}
      </Text>
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
        confirmLabel={isPending ? (isOwner ? "Deleting..." : "Leaving...") : (isOwner ? "Delete" : "Leave")}
        cancelLabel="Cancel"
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
    marginTop: 8,
    gap: 4,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
    marginBottom: 20,
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
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  sectionLabelTop: {
    marginTop: 16,
  },
  card: {
    backgroundColor: Colors.bg.surface,
    borderRadius: 16,
  },
  dangerBtn: {
    marginTop: 8,
  },
  scrollContentPadding: {
    paddingBottom: 100,
  },
});
