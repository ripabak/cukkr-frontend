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
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";

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
  const { t } = useI18nContext();
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
          toast.success(t("toast.deleteSuccess"));
          setRemoveTarget(null);
        },
        onError: (e) => {
          toast.error(e.message || t("toast.unknownError"));
          setRemoveTarget(null);
        },
      });
    } else {
      removeBarber(removeTarget.memberIdOrEmail ?? removeTarget.id, {
        onSuccess: () => {
          toast.success(t("toast.memberRemoved"));
          setRemoveTarget(null);
        },
        onError: (e) => {
          toast.error(e.message || t("toast.unknownError"));
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
          toast.success(t("toast.updateSuccess"));
          setRoleChangeTarget(null);
        },
        onError: (e) => {
          toast.error(e.message || t("toast.unknownError"));
          setRoleChangeTarget(null);
        },
      },
    );
  };

  const isLoading = loadingMembers || loadingInvitations;

  return (
    <ScreenShell
      hideAppHeader
      headerSlot={<ScreenHeader onBack={() => router.back()} />}
      contentStyle={{ paddingBottom: 200 }}
    >
      <AppText style={styles.title}>{t("barbers.title")}</AppText>
      <AppText style={styles.subtitle}>{t("barbers.title")}</AppText>

      {!isLoading && pendingInvitations.length > 0 ? (
        <>
          <AppText style={styles.sectionLabel}>{t("barbers.inviteBarber")}</AppText>
          <View style={styles.list}>
            {pendingInvitations.map((inv, index) => (
              <MemberCard
                key={inv.id}
                name={inv.email}
                nameSmall
                role={inv.role}
                status={t("schedule.status.waiting")}
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
          <AppText style={styles.sectionLabel}>{t("barbers.addBarber")}</AppText>
          <View style={styles.list}>
            {members.map((member, index) => {
              const isYou = member.userId === currentUser?.id;
              const isOwner = member.role === "owner";
              const canChangeRole = canManage && !isOwner && !isYou;
              return (
                <MemberCard
                  key={member.id}
                  name={member.user.name}
                  imageUri={member.user.image ?? undefined}
                  role={member.role}
                  isYou={isYou}
                  status={t("services.active")}
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
        <AppText style={styles.empty}>{t("barbers.noBarbers")}</AppText>
      ) : null}

      <Permission roles={["owner", "admin"]}>
        <PrimaryButton
          label={t("barbers.inviteBarber")}
          onPress={() => router.push("/d/invite-barber")}
          style={styles.inviteBtn}
        />
      </Permission>

      <ConfirmationModal
        visible={!!removeTarget}
        icon="person-remove-outline"
        title={
          removeTarget?.type === "invitation"
            ? t("barbers.inviteBarber")
            : t("common.delete")
        }
        description={
          removeTarget?.type === "invitation"
            ? t("barbers.inviteBarber")
            : t("barbers.removeConfirm")
        }
        confirmLabel={
          isPending
            ? t("common.saving")
            : removeTarget?.type === "invitation"
              ? t("common.delete")
              : t("common.delete")
        }
        cancelLabel={t("common.cancel")}
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
    fontSize: 32,
    fontWeight: "700",
    color: Colors.text.primary,
    marginTop: 8,
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 4,
    marginBottom: 24,
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
    marginBottom: 16,
  },
  empty: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 40,
  },
});
