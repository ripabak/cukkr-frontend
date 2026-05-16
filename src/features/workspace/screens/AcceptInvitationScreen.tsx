import { Colors } from '@/src/theme/colors';
import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenShell } from "@/src/components/ScreenShell";
import {
  useAcceptInvitation,
  useRejectInvitation,
} from "@/src/features/workspace/hooks/useBarbersMutations";
import { useGetInvitation } from "@/src/features/workspace/hooks/useBarbersQueries";
import { authClient } from "@/src/lib/auth-client";
import { useToast } from "@/src/lib/providers";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
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

  const { data: invitation, isLoading, error } = useGetInvitation(invitationId);
  const { mutate: accept, isPending: isAccepting } = useAcceptInvitation();
  const { mutate: reject, isPending: isRejecting } = useRejectInvitation();

  const isPending = isAccepting || isRejecting;

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
        <Text style={styles.title}>You're Invited!</Text>
        <Text style={styles.subtitle}>
          Log in to your account to view and accept this barbershop invitation.
        </Text>
        <PrimaryButton
          label="Log In to Continue"
          onPress={() =>
            router.push({
              pathname: "/d/(auth)/login",
              params: { redirect: `/accept-invitation/${invitationId}` },
            })
          }
          style={styles.loginButton}
        />
        <TouchableOpacity
          onPress={() => router.push("/d/(auth)/register")}
          style={styles.registerLink}
          activeOpacity={0.7}
        >
          <Text style={styles.registerLinkText}>
            Don't have an account?{" "}
            <Text style={styles.registerLinkBold}>Register</Text>
          </Text>
        </TouchableOpacity>
      </ScreenShell>
    );
  }

  if (isLoading) {
    return (
      <ScreenShell>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.text.primary} />
          <Text style={styles.loadingText}>Loading invitation...</Text>
        </View>
      </ScreenShell>
    );
  }

  if (error || !invitation) {
    return (
      <ScreenShell>
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={56} color="#666666" />
          <Text style={styles.errorTitle}>Invitation Not Found</Text>
          <Text style={styles.errorSubtitle}>
            This invitation may have expired, already been used, or is not
            intended for your account.
          </Text>
          <TouchableOpacity
            style={styles.backLink}
            onPress={() => router.replace("/")}
            activeOpacity={0.7}
          >
            <Text style={styles.backLinkText}>Go to Home</Text>
          </TouchableOpacity>
        </View>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell>
      <View style={styles.iconWrapper}>
        <Ionicons name="cut-outline" size={48} color={Colors.text.primary} />
      </View>

      <Text style={styles.title}>You're Invited!</Text>
      <Text style={styles.subtitle}>
        You have been invited to join a barbershop team.
      </Text>

      <View style={styles.card}>
        <View style={styles.cardRow}>
          <Ionicons name="storefront-outline" size={20} color="#666666" />
          <View style={styles.cardTextWrapper}>
            <Text style={styles.cardLabel}>Barbershop</Text>
            <Text style={styles.cardValue}>{invitation.organizationName}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardRow}>
          <Ionicons name="person-outline" size={20} color="#666666" />
          <View style={styles.cardTextWrapper}>
            <Text style={styles.cardLabel}>Invited by</Text>
            <Text style={styles.cardValue}>{invitation.inviterEmail}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardRow}>
          <Ionicons name="ribbon-outline" size={20} color="#666666" />
          <View style={styles.cardTextWrapper}>
            <Text style={styles.cardLabel}>Role</Text>
            <Text style={styles.cardValue}>
              {invitation.role.charAt(0).toUpperCase() +
                invitation.role.slice(1)}
            </Text>
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
          <Text style={styles.rejectLabel}>
            {isRejecting ? "Declining..." : "Decline"}
          </Text>
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
