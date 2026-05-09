import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { MemberCard } from "@/src/components/MemberCard";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

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
      <Text className="text-[28px] font-bold text-dark mt-sm">Barbers Management</Text>
      <Text className="text-[14px] text-gray mt-[4px] mb-xl">Manage your barbershop team members</Text>

      <View className="mb-xxl">
        {barbers.map((barber, index) => (
          <MemberCard
            key={barber.id}
            name={barber.name}
            status={barber.status}
            statusVariant={barber.status === "Pending" ? "pending" : "active"}
            onRemove={() => handleRemove(barber)}
            style={index < barbers.length - 1 ? { marginBottom: 12 } : undefined}
          />
        ))}
      </View>

      <Text className="text-[13px] text-gray mb-sm">Invite Barber</Text>
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
