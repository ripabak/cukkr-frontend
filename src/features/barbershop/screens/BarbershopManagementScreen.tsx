import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { MemberCard } from "@/src/components/MemberCard";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import {
  useBarbersList,
  useCancelBarberInvitation,
  useRemoveBarber,
} from "@/src/features/barbershop/hooks";
import { useToast } from "@/src/lib/providers";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface BarberTarget {
  id: string;
  name: string;
  status: "active" | "pending";
  userId: string | null;
}

export function BarbershopManagementScreen() {
  const router = useRouter();
  const toast = useToast();
  const { data: barbers = [], isLoading, refetch } = useBarbersList();
  const { mutate: removeBarber, isPending: isRemoving } = useRemoveBarber();
  const { mutate: cancelInvite, isPending: isCanceling } = useCancelBarberInvitation();
  const [removeTarget, setRemoveTarget] = useState<BarberTarget | null>(null);

  const isPending = isRemoving || isCanceling;

  const handleConfirmRemove = () => {
    if (!removeTarget) return;

    if (removeTarget.status === "pending") {
      cancelInvite(removeTarget.id, {
        onSuccess: () => {
          toast.success("Invitation cancelled");
          setRemoveTarget(null);
          refetch();
        },
        onError: (e) => {
          toast.error(e.message || "Failed to cancel invitation");
          setRemoveTarget(null);
        },
      });
    } else {
      const memberIdOrEmail = removeTarget.userId ?? removeTarget.id;
      removeBarber(memberIdOrEmail, {
        onSuccess: () => {
          toast.success(`${removeTarget.name} removed`);
          setRemoveTarget(null);
          refetch();
        },
        onError: (e) => {
          toast.error(e.message || "Failed to remove barber");
          setRemoveTarget(null);
        },
      });
    }
  };

  return (
    <ScreenShell>
      <ScreenHeader onBack={() => router.back()} />
      <Text style={styles.title}>Barbers Management</Text>
      <Text style={styles.subtitle}>Manage your barbershop team members</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#C6FF4D" style={styles.loader} />
      ) : barbers.length === 0 ? (
        <Text style={styles.empty}>No barbers yet. Invite one below.</Text>
      ) : (
        <View style={styles.list}>
          {barbers.map((barber, index) => (
            <MemberCard
              key={barber.id}
              name={barber.name}
              status={barber.status === "pending" ? "Pending" : "Active"}
              statusVariant={barber.status === "pending" ? "pending" : "active"}
              onRemove={() =>
                setRemoveTarget({
                  id: barber.id,
                  name: barber.name,
                  status: barber.status,
                  userId: barber.userId,
                })
              }
              style={index < barbers.length - 1 ? styles.cardMargin : undefined}
            />
          ))}
        </View>
      )}

      <Text style={styles.sectionLabel}>Invite Barber</Text>
      <PrimaryButton
        label="Invite Barber"
        onPress={() => router.push("/invite-barber")}
      />

      <ConfirmationModal
        visible={!!removeTarget}
        icon="person-remove-outline"
        title={removeTarget?.status === "pending" ? "Cancel Invitation" : "Remove Barber"}
        description={
          removeTarget?.status === "pending"
            ? `Cancel the invitation for ${removeTarget?.name}?`
            : `Are you sure you want to remove ${removeTarget?.name} from your barbershop?`
        }
        confirmLabel={isPending ? "Processing..." : removeTarget?.status === "pending" ? "Cancel Invite" : "Remove"}
        cancelLabel="Back"
        onConfirm={handleConfirmRemove}
        onCancel={() => setRemoveTarget(null)}
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
  loader: {
    marginTop: 40,
  },
  empty: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginTop: 40,
  },
  list: {
    marginBottom: 24,
  },
  cardMargin: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 13,
    color: "#666666",
    marginBottom: 8,
  },
});
