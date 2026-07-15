import { Colors } from "@/src/theme/colors";
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import { useSignOut } from "@/src/features/auth/hooks";
import {
  useAcceptInvitation,
  useRejectInvitation,
} from "@/src/features/workspace/hooks/useBarbersMutations";
import { useGetInvitation } from "@/src/features/workspace/hooks/useBarbersQueries";
import { ApiError } from "@/src/features/workspace/services/barbers.service";
import { authClient } from "@/src/lib/auth-client";
import { useToast } from "@/src/lib/providers";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { AppText } from "@/src/components/AppText";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  invitationId: string;
}

export function AcceptInvitationScreen({ invitationId }: Props) {
  const router = useRouter();
  const toast = useToast();
  const { data: session, isPending: sessionLoading } = authClient.useSession();

  const {
    data: invitation,
    isLoading,
    error,
  } = useGetInvitation(invitationId, !!session);
  const { mutate: accept, isPending: isAccepting } = useAcceptInvitation();
  const { mutate: reject, isPending: isRejecting } = useRejectInvitation();
  const { mutateAsync: signOut } = useSignOut();

  const isPending = isAccepting || isRejecting;

  const handleSwitchAccount = async () => {
    await signOut();
  };

  const handleAccept = () => {
    accept(invitationId, {
      onSuccess: () => {
        toast.success("You've joined the barbershop!");
        router.replace("/");
      },
      onError: (e) => {
        toast.error(e.message || "Failed to accept invitation");
      },
    });
  };

  const handleReject = () => {
    reject(invitationId, {
      onSuccess: () => {
        toast.success("Invitation declined");
        router.replace("/");
      },
      onError: (e) => {
        toast.error(e.message || "Failed to decline invitation");
      },
    });
  };

  if (sessionLoading) {
    return (
      <ScreenShell>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.text.primary} />
        </View>
      </ScreenShell>
    );
  }

  if (!session) {
    return (
      <ScreenShell>
        <View style={styles.iconWrapper}>
          <Ionicons name="mail-outline" size={56} color={Colors.text.primary} />
        </View>
        <AppText style={styles.title}>You're Invited!</AppText>
        <AppText style={styles.subtitle}>
          Log in to your account to view and accept this barbershop invitation.
        </AppText>
        <PrimaryButton
          label="Log In to Continue"
          onPress={() =>
            router.push({
              pathname: "/d/(auth)/login",
              params: { redirect: `/d/accept-invitation?id=${invitationId}` },
            })
          }
          style={styles.loginButton}
        />
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/d/(auth)/register",
              params: { redirect: `/d/accept-invitation?id=${invitationId}` },
            })
          }
          style={styles.registerLink}
          activeOpacity={0.7}
        >
          <AppText style={styles.registerLinkText}>
            Don't have an account?{" "}
            <AppText style={styles.registerLinkBold}>Register</AppText>
          </AppText>
        </TouchableOpacity>
      </ScreenShell>
    );
  }

  if (isLoading) {
    return (
      <ScreenShell>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.text.primary} />
          <AppText style={styles.loadingText}>Loading invitation...</AppText>
        </View>
      </ScreenShell>
    );
  }

  if (error || !invitation) {
    const isEmailMismatchError =
      error instanceof ApiError && error.status === 403;
    return (
      <ScreenShell>
        <View style={styles.center}>
          <Ionicons
            name={
              isEmailMismatchError
                ? "person-circle-outline"
                : "alert-circle-outline"
            }
            size={56}
            color="#666666"
          />
          <AppText style={styles.errorTitle}>
            {isEmailMismatchError ? "Wrong Account" : "Invitation Not Found"}
          </AppText>
          <AppText style={styles.errorSubtitle}>
            {isEmailMismatchError
              ? "This invitation was sent to a different email address. Please sign in with the correct account to accept it."
              : "This invitation may have expired, already been used, or is not intended for your account."}
          </AppText>
          {isEmailMismatchError ? (
            <TouchableOpacity
              style={styles.backLink}
              onPress={handleSwitchAccount}
              activeOpacity={0.7}
            >
              <AppText style={styles.backLinkText}>
                Sign in with different account
              </AppText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.backLink}
              onPress={() => router.replace("/")}
              activeOpacity={0.7}
            >
              <AppText style={styles.backLinkText}>Go to Home</AppText>
            </TouchableOpacity>
          )}
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <View style={styles.iconWrapper}>
        <Ionicons name="cut-outline" size={48} color={Colors.text.primary} />
      </View>

      <AppText style={styles.title}>You're Invited!</AppText>
      <AppText style={styles.subtitle}>
        You have been invited to join a barbershop team.
      </AppText>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Ionicons name="storefront-outline" size={20} color="#666666" />
          <View style={styles.cardTextWrapper}>
            <AppText style={styles.cardLabel}>Barbershop</AppText>
            <AppText style={styles.cardValue}>{invitation.organizationName}</AppText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardRow}>
          <Ionicons name="person-outline" size={20} color="#666666" />
          <View style={styles.cardTextWrapper}>
            <AppText style={styles.cardLabel}>Invited by</AppText>
            <AppText style={styles.cardValue}>{invitation.inviterEmail}</AppText>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardRow}>
          <Ionicons name="ribbon-outline" size={20} color="#666666" />
          <View style={styles.cardTextWrapper}>
            <AppText style={styles.cardLabel}>Role</AppText>
            <AppText style={styles.cardValue}>
              {invitation.role.charAt(0).toUpperCase() +
                invitation.role.slice(1)}
            </AppText>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label={isAccepting ? "Accepting..." : "Accept Invitation"}
          onPress={handleAccept}
          disabled={isPending}
        />
        <TouchableOpacity
          style={[styles.rejectBtn, isPending && styles.disabled]}
          onPress={handleReject}
          activeOpacity={0.7}
          disabled={isPending}
        >
          <AppText style={styles.rejectLabel}>
            {isRejecting ? "Declining..." : "Decline"}
          </AppText>
        </TouchableOpacity>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.text.primary,
    textAlign: "center",
  },
  errorSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 20,
  },
  backLink: {
    marginTop: 16,
  },
  backLinkText: {
    fontSize: 14,
    color: Colors.text.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  iconWrapper: {
    alignItems: "center",
    marginTop: 48,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text.primary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 28,
    lineHeight: 20,
  },
  loginButton: {
    marginTop: 8,
  },
  registerLink: {
    marginTop: 16,
    alignItems: "center",
  },
  registerLinkText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  registerLinkBold: {
    fontWeight: "700",
    color: Colors.text.primary,
  },
  card: {
    backgroundColor: Colors.bg.default,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 4,
  },
  cardTextWrapper: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 12,
    color: "#999999",
    marginBottom: 2,
  },
  cardValue: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 12,
  },
  actions: {
    gap: 12,
  },
  rejectBtn: {
    height: 52,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  rejectLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  disabled: {
    opacity: 0.5,
  },
});
