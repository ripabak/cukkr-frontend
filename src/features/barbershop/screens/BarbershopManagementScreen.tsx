import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { MemberCard } from "@/src/components/MemberCard";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface Barber {
  id: string;
  name: string;
  status: "Active" | "Pending";
}

const MOCK_BARBERS: Barber[] = [
  { id: "1", name: "John Doe", status: "Active" },
  { id: "2", name: "Jane Smith", status: "Pending" },
  { id: "3", name: "Mike Johnson", status: "Active" },
];

export function BarbershopManagementScreen() {
  const router = useRouter();
  const [barbers, setBarbers] = useState<Barber[]>(MOCK_BARBERS);
  const [removeTarget, setRemoveTarget] = useState<Barber | null>(null);

  const handleRemove = (barber: Barber) => {
    setRemoveTarget(barber);
  };

  const confirmRemove = () => {
    if (removeTarget) {
      setBarbers((prev) => prev.filter((b) => b.id !== removeTarget.id));
      setRemoveTarget(null);
    }
  };

  return (
    <ScreenShell>
      <ScreenHeader onBack={() => router.back()} />
      <Text style={styles.title}>Barbers Management</Text>
      <Text style={styles.subtitle}>Manage your barbershop team members</Text>

      <View style={styles.list}>
        {barbers.map((barber, index) => (
          <MemberCard
            key={barber.id}
            name={barber.name}
            status={barber.status}
            statusVariant={barber.status === "Pending" ? "pending" : "active"}
            onRemove={() => handleRemove(barber)}
            style={index < barbers.length - 1 ? styles.cardMargin : undefined}
          />
        ))}
      </View>

      <Text style={styles.sectionLabel}>Invite Barber</Text>
      <PrimaryButton
        label="Invite Barber"
        onPress={() => router.push("/invite-barber")}
      />
      <ConfirmationModal
        visible={!!removeTarget}
        icon="person-remove-outline"
        title="Remove Barber"
        description={`Are you sure you want to remove ${removeTarget?.name} from your barbershop?`}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={confirmRemove}
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
