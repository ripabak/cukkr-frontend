import { Colors } from "@/src/theme/colors";
import React from "react";
import { AppText } from "@/src/components/AppText";
import { useI18nContext } from "@/src/lib/i18n/provider";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBadge } from "@/src/components/StatusBadge";

type StatusVariant = "active" | "pending" | "default";

interface Props {
  name: string;
  nameSmall?: boolean;
  role?: string;
  isYou?: boolean;
  imageUri?: string;
  status: string;
  statusVariant?: StatusVariant;
  onRemove?: () => void;
  roleChangeable?: boolean;
  onRoleChange?: () => void;
  style?: ViewStyle;
}

export function MemberCard({
  name,
  nameSmall,
  role,
  isYou,
  imageUri,
  roleChangeable,
  status,
  statusVariant = "active",
  onRemove,
  onRoleChange,
  style,
}: Props) {
  const { t } = useI18nContext();
  const useCompactLayout = roleChangeable !== undefined;

  const roleElement = role ? (
    roleChangeable ? (
      <TouchableOpacity
        key="role-btn"
        onPress={onRoleChange}
        activeOpacity={0.7}
        style={styles.roleBtn}
      >
        <AppText style={styles.roleBtnText}>
          {role.charAt(0).toUpperCase() + role.slice(1)}
        </AppText>
      </TouchableOpacity>
    ) : (
      <AppText key="role-text" style={styles.role}>
        {role}
      </AppText>
    )
  ) : null;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.avatar}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatarImage} />
        ) : (
          <Ionicons name="person-outline" size={24} color={Colors.icon.muted} />
        )}
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <AppText
            style={[styles.name, nameSmall && styles.nameSmall]}
            numberOfLines={1}
          >
            {name}
          </AppText>
          {isYou ? <AppText style={styles.you}>{t("components.memberCard.youLabel")}</AppText> : null}
        </View>
        {roleElement}
      </View>
      <View style={styles.actions}>
        {!useCompactLayout ? (
          <StatusBadge label={status} variant={statusVariant} />
        ) : null}
        {onRemove ? (
          <TouchableOpacity
            onPress={onRemove}
            activeOpacity={0.7}
            style={styles.removeBtn}
          >
            <Ionicons name="close" size={14} color={Colors.text.primary} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.brand.primarySurface,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.bg.surface,
    overflow: "hidden",
    flexShrink: 0,
    borderWidth: 1.5,
    borderColor: Colors.border.default,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text.primary,
    flexShrink: 1,
  },
  nameSmall: {
    fontSize: 13,
    fontWeight: "500",
  },
  you: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: "400",
  },
  role: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
    textTransform: "capitalize",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 0,
  },
  roleBtn: {
    alignSelf: "flex-start",
    marginTop: 4,
    backgroundColor: Colors.bg.surface,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  roleBtnText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
