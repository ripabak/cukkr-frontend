import { Colors } from "@/src/theme/colors";
import { ConfirmationModal } from "@/src/components/ConfirmationModal";
import { Permission } from "@/src/components/Permission";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { MemberCard } from "@/src/features/barbershop/components/MemberCard";
import { RoleChangeModal } from "@/src/features/barbershop/components/RoleChangeModal";
import {
  useBarbersInvitations,
  useBarbersList,
  useCancelBarberInvitation,
  useRemoveBarber,
  useUpdateMemberRole,
} from "@/src/features/barbershop/hooks";
import { useAuthUser, useMemberRole } from "@/src/hooks";
import { useToast } from "@/src/lib/providers";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

interface RemoveTarget {
  id: string;
  name: string;
  type: "member" | "invitation";
  memberIdOrEmail?: string;
}

interface RoleChangeTarget {
  memberId: string;
  name: string;
  currentRole: string;
}

export function BarbersManagementScreen() {
  const router = useRouter();
  const toast = useToast();
  const { user: currentUser } = useAuthUser();
  const { role } = useMemberRole();
  const canManage = role === "owner" || role === "admin";

  const { data: members = [], isLoading: loadingMembers } = useBarbersList();
  const { data: invitations = [], isLoading: loadingInvitations } =
    useBarbersInvitations();
  const { mutate: removeBarber, isPending: isRemoving } = useRemoveBarber();
  const { mutate: cancelInvite, isPending: isCanceling } =
    useCancelBarberInvitation();
  const { mutate: updateRole, isPending: isUpdatingRole } =
    useUpdateMemberRole();

  const [removeTarget, setRemoveTarget] = useState<RemoveTarget | null>(null);
  const [roleChangeTarget, setRoleChangeTarget] =
    useState<RoleChangeTarget | null>(null);

  const isPending = isRemoving || isCanceling;
  const pendingInvitations = invitations.filter(
    (inv) => inv.status === "pending",
  );

  const handleConfirmRemove = () => {
    if (!removeTarget) return;

    if (removeTarget.type === "invitation") {
      cancelInvite(removeTarget.id, {
        onSuccess: () => {
          toast.success("Invitation cancelled");
          setRemoveTarget(null);
        },
        onError: (e) => {
          toast.error(e.message || "Failed to cancel invitation");
          setRemoveTarget(null);
        },
      });
    } else {
      removeBarber(removeTarget.memberIdOrEmail ?? removeTarget.id, {
        onSuccess: () => {
          toast.success(`${removeTarget.name} removed`);
          setRemoveTarget(null);
        },
        onError: (e) => {
          toast.error(e.message || "Failed to remove barber");
          setRemoveTarget(null);
        },
      });
    }
  };

  const handleRoleChangeSave = (newRole: "admin" | "member") => {
    if (!roleChangeTarget) return;

    updateRole(
      { memberId: roleChangeTarget.memberId, role: newRole },
      {
        onSuccess: () => {
          toast.success("Role updated");
          setRoleChangeTarget(null);
        },
        onError: (e) => {
          toast.error(e.message || "Failed to update role");
          setRoleChangeTarget(null);
        },
      },
    );
  };

  const isLoading = loadingMembers || loadingInvitations;

  return (
    <ScreenShell headerSlot={<ScreenHeader onBack={() => router.back()} />}>
      <Text style={styles.title}>Barbers Management</Text>
      <Text style={styles.subtitle}>Manage your barbershop team members</Text>

      {!isLoading && pendingInvitations.length > 0 ? (
        <>
          <Text style={styles.sectionLabel}>Pending Invitations</Text>
          <View style={styles.list}>
            {pendingInvitations.map((inv, index) => (
              <MemberCard
                key={inv.id}
                name={inv.email}
                nameSmall
                role={inv.role}
                status="Pending"
                statusVariant="pending"
                onRemove={
                  canManage
                    ? () =>
                        setRemoveTarget({
                          id: inv.id,
                          name: inv.email,
                          type: "invitation",
                        })
                    : undefined
                }
                style={
                  index < pendingInvitations.length - 1
                    ? styles.cardMargin
                    : undefined
                }
              />
            ))}
          </View>
        </>
      ) : null}

      {!isLoading && members.length > 0 ? (
        <>
          <Text style={styles.sectionLabel}>Team</Text>
          <View style={styles.list}>
            {members.map((member, index) => {
              const isYou = member.userId === currentUser?.id;
              const isOwner = member.role === "owner";
              const canChangeRole = canManage && !isOwner && !isYou;
              return (
                <MemberCard
                  key={member.id}
                  name={member.user.name}
                  role={member.role}
                  isYou={isYou}
                  status="Active"
                  statusVariant="active"
                  roleChangeable={canChangeRole}
                  onRoleChange={
                    canChangeRole
                      ? () =>
                          setRoleChangeTarget({
                            memberId: member.id,
                            name: member.user.name,
                            currentRole: member.role,
                          })
                      : undefined
                  }
                  onRemove={
                    isOwner || !canManage
                      ? undefined
                      : () =>
                          setRemoveTarget({
                            id: member.id,
                            name: member.user.name,
                            type: "member",
                            memberIdOrEmail: member.id,
                          })
                  }
                  style={
                    index < members.length - 1 ? styles.cardMargin : undefined
                  }
                />
              );
            })}
          </View>
        </>
      ) : null}

      {!isLoading && members.length === 0 && pendingInvitations.length === 0 ? (
        <Text style={styles.empty}>No barbers yet. Invite one above.</Text>
      ) : null}

      <Permission roles={["owner", "admin"]}>
        <PrimaryButton
          label="Invite Barber"
          onPress={() => router.push("/d/invite-barber")}
          style={styles.inviteBtn}
        />
      </Permission>

      <ConfirmationModal
        visible={!!removeTarget}
        icon="person-remove-outline"
        title={
          removeTarget?.type === "invitation"
            ? "Cancel Invitation"
            : "Remove Barber"
        }
        description={
          removeTarget?.type === "invitation"
            ? `Cancel the invitation for ${removeTarget?.name}?`
            : `Are you sure you want to remove ${removeTarget?.name} from your barbershop?`
        }
        confirmLabel={
          isPending
            ? "Processing..."
            : removeTarget?.type === "invitation"
              ? "Cancel Invite"
              : "Remove"
        }
        cancelLabel="Back"
        onConfirm={handleConfirmRemove}
        onCancel={() => setRemoveTarget(null)}
      />

      <RoleChangeModal
        visible={!!roleChangeTarget}
        memberName={roleChangeTarget?.name ?? ""}
        currentRole={roleChangeTarget?.currentRole ?? "member"}
        onSave={handleRoleChangeSave}
        onCancel={() => setRoleChangeTarget(null)}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text.primary,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
    marginBottom: 20,
  },
  inviteBtn: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  list: {
    marginBottom: 24,
  },
  cardMargin: {
    marginBottom: 12,
  },
  empty: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 40,
  },
});
