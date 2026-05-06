import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { DangerButton } from "@/src/components/DangerButton";
import { InfoRow } from "@/src/components/InfoRow";
import { OperationRow } from "@/src/components/OperationRow";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import {
  useBarbershopCurrent,
  useLeaveBarbershop,
} from "@/src/features/barbershop/hooks";
import { useToast } from "@/src/lib/providers";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
  const { mutate: leave, isPending: isLeaving } = useLeaveBarbershop();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteConfirm = () => {
    if (!barbershop?.id) return;
    leave(barbershop.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        toast.success("Barbershop deleted");
        router.replace("/switch-barbershop");
      },
      onError: (error) => {
        setShowDeleteModal(false);
        toast.error(error.message || "Failed to delete barbershop");
      },
    });
  };

  const handleCameraBadge = () => {
    Alert.alert("Logo Upload", "Logo upload will be available soon.");
  };

  return (
    <ScreenShell contentStyle={styles.scrollContentPadding}>
      <ScreenHeader onBack={() => router.back()} />
      <Text style={styles.title}>Barbershop Settings</Text>
      <Text style={styles.subtitle}>Setup based on your barbershop needs</Text>

      <View style={styles.avatarWrapper}>
        <TouchableOpacity onPress={handleCameraBadge} activeOpacity={0.8}>
          {barbershop?.logoUrl ? (
            <Image
              source={{ uri: barbershop.logoUrl }}
              style={styles.avatarCircle}
              contentFit="cover"
            />
          ) : (
            <View style={styles.avatarCircle} />
          )}
          <View style={styles.cameraBadge}>
            <Ionicons name="camera" size={14} color="#FFFFFF" />
          </View>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#C6FF4D"
          style={styles.loader}
        />
      ) : (
        <>
          <Text style={styles.sectionLabel}>Information</Text>
          <View style={styles.card}>
            <InfoRow
              label="Name"
              value={barbershop?.name ?? "—"}
              showChevron
              onPress={() =>
                router.push({
                  pathname: "/edit-barbershop-info",
                  params: { mode: "name" },
                })
              }
            />
            <InfoRow
              label="Description"
              value={barbershop?.description ?? "—"}
              showChevron
              onPress={() =>
                router.push({
                  pathname: "/edit-barbershop-info",
                  params: { mode: "description" },
                })
              }
            />
            <InfoRow
              label="Address"
              value={barbershop?.address ?? "—"}
              showChevron
              isLast
              onPress={() =>
                router.push({
                  pathname: "/edit-barbershop-info",
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
                  ? `https://cukkr.com/${barbershop.slug}`
                  : "—"
              }
              showChevron
              isLast
              onPress={() => router.push("/edit-booking-url")}
            />
          </View>

          <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>
            Operations
          </Text>
          <View style={styles.card}>
            <OperationRow
              label="Barbers"
              onPress={() => router.push("/barbers-management")}
            />
            <OperationRow
              label="Customers"
              onPress={() => router.push("/customer-management")}
            />
            <OperationRow
              label="Open Hours"
              isLast
              onPress={() => router.push("/open-hours")}
            />
          </View>

          <Text style={[styles.sectionLabel, styles.sectionLabelTop]}>
            Delete Barbershop
          </Text>
          <DangerButton
            label="Delete This Barbershop"
            onPress={() => setShowDeleteModal(true)}
            style={styles.dangerBtn}
          />
        </>
      )}

      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete Barbershop"
        description="Are you sure you want to delete this barbershop? This action cannot be undone."
        confirmLabel={isLeaving ? "Deleting..." : "Delete"}
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
    marginBottom: 20,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#D9D9D9",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  loader: {
    marginTop: 40,
  },
  sectionLabel: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 8,
  },
  sectionLabelTop: {
    marginTop: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
  },
  dangerBtn: {
    marginTop: 8,
  },
  scrollContentPadding: {
    paddingBottom: 100,
  },
});
