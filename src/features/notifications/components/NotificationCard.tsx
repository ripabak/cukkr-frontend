import { useI18nContext } from "@/src/lib/i18n/provider";
import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import React from "react";
import { AppText } from "@/src/components/AppText";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBadge } from "@/src/components/StatusBadge";
import { InlineDecisionButtons } from "./InlineDecisionButtons";

export type NotificationType =
  | "appointment-request"
  | "walk-in"
  | "invitation"
  | "general";

interface Props {
  type: NotificationType;
  title: string;
  name: string;
  detail?: string;
  timestamp: string;
  organizationName?: string;
  status?: "pending" | "declined" | "accepted";
  showActions?: boolean;
  isClickable?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  onPress?: () => void;
  style?: ViewStyle;
}

const TYPE_ICON: Record<
  NotificationType,
  React.ComponentProps<typeof Ionicons>["name"]
> = {
  "appointment-request": "calendar",
  "walk-in": "walk",
  invitation: "person-add",
  general: "notifications",
};

export function NotificationCard({
  type,
  title,
  name,
  detail,
  timestamp,
  organizationName,
  status,
  showActions,
  isClickable,
  onAccept,
  onDecline,
  onPress,
  style,
}: Props) {
  const { t } = useI18nContext();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={isClickable ? 0.85 : 1}
      style={[styles.card, Neu.raised(colors.bg.surface), style]}
    >
      <View style={styles.topRow}>
        <AppText style={styles.typeLabel}>
          {organizationName || title}
        </AppText>
        <View style={styles.topRight}>
          <AppText style={styles.timestamp}>{timestamp}</AppText>
          {isClickable ? (
            <Ionicons
              name="chevron-forward"
              size={13}
              color={colors.text.muted}
              style={styles.chevron}
            />
          ) : null}
        </View>
      </View>
      <View style={styles.bodyRow}>
        <View style={styles.bodyLeft}>
          {status === "pending" ? <View style={[styles.dot, Neu.inset(colors.bg.surface, 0.6)]} /> : null}
          <View style={styles.bodyText}>
            <AppText style={styles.name}>{name}</AppText>
            {detail ? <AppText style={styles.detail}>{detail}</AppText> : null}
            {status === "accepted" ? (
              <StatusBadge
                label={t("notifications.actions.accepted")}
                variant="active"
                style={styles.declinedBadge}
              />
            ) : null}
            {status === "declined" ? (
              <StatusBadge
                label={t("notifications.actions.declined")}
                variant="declined"
                style={styles.declinedBadge}
              />
            ) : null}
            {showActions && status === "pending" ? (
              <InlineDecisionButtons
                onDecline={onDecline}
                onAccept={onAccept}
              />
            ) : null}
          </View>
        </View>
        <View style={[styles.iconCircle, Neu.inset(colors.bg.surface, 0.6)]}>
          <Ionicons
            name={TYPE_ICON[type]}
            size={20}
            color={colors.icon.muted}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  chevron: {
    opacity: 0.5,
  },
  typeLabel: {
    fontSize: 12,
    color: c.icon.muted,
    fontWeight: "500",
  },
  timestamp: {
    fontSize: 12,
    color: c.text.muted,
  },
  bodyRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  bodyLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: c.status.inProgress,
    marginTop: 6,
  },
  bodyText: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    color: c.text.primary,
    marginBottom: 4,
  },
  detail: {
    fontSize: 13,
    color: c.text.secondary,
    lineHeight: 18,
  },
  declinedBadge: {
    marginTop: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  });
