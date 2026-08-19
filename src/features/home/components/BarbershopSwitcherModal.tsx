import { AppText } from "@/src/components/AppText";
import { AppTextInput } from "@/src/components/AppTextInput";
import { BottomSheet } from "@/src/components/BottomSheet";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { haptics } from "@/src/utils/haptics";
import { authClient } from "@/src/lib/auth-client";
import { useToast } from "@/src/lib/providers";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useBarbershopList,
  useSetActiveOrganization,
} from "@/src/features/workspace/hooks";
import { WORKSPACE_SCOPED_KEYS } from "@/src/features/workspace/hooks/useOrganizationMutations";
import { useUnreadCountByOrg } from "@/src/features/notifications/hooks/useNotificationsQueries";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function BarbershopSwitcherModal({ visible, onClose }: Props) {
  const { t } = useI18nContext();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  const queryClient = useQueryClient();
  const { data: barbershops = [], isLoading } = useBarbershopList();
  const { mutate: setActive } = useSetActiveOrganization();
  const { data: sessionData } = authClient.useSession();
  const { data: unreadByOrg = [] } = useUnreadCountByOrg();

  const unreadCountMap = Object.fromEntries(
    unreadByOrg.map((item) => [item.organizationId, item.count]),
  );

  const [isSwitchingWorkspace, setIsSwitchingWorkspace] = useState(false);

  // Reset search + gate the switching veil while the sheet animates away.
  useEffect(() => {
    if (visible) setSearch("");
  }, [visible]);

  const filtered = barbershops.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (id: string) => {
    if (sessionData?.session?.activeOrganizationId === id) {
      haptics.selection();
      onClose();
      return;
    }

    haptics.medium();
    onClose();
    setTimeout(() => {
      setIsSwitchingWorkspace(true);
      setActive(id, {
        onSuccess: async () => {
          await authClient.getSession();
          WORKSPACE_SCOPED_KEYS.forEach((key) => {
            queryClient.resetQueries({ queryKey: key });
          });
          setIsSwitchingWorkspace(false);
        },
        onError: (error) => {
          setIsSwitchingWorkspace(false);
          toast.error(t("toast.switchFailed") + ": " + error.message);
        },
      });
    }, 200);
  };

  const handleCreateNew = () => {
    haptics.light();
    onClose();
    router.push("/d/create-barbershop-name-logo");
  };

  return (
    <>
      {/* Workspace switching veil */}
      <Modal
        visible={isSwitchingWorkspace}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.switchingOverlay}>
          <View style={styles.switchingCard}>
            <ActivityIndicator size="large" color={colors.brand.primary} />
            <AppText style={styles.switchingTitle}>
              {t("barbershop.switchingWorkspace")}
            </AppText>
            <AppText style={styles.switchingSubText}>
              {t("barbershop.pleaseWait")}
            </AppText>
          </View>
        </View>
      </Modal>

      <BottomSheet
        visible={visible && !isSwitchingWorkspace}
        onClose={onClose}
        title={t("barbershop.switcherTitle")}
        subtitle={t("barbershop.switchSubtitle")}
        scrollable
        maxHeightFraction={0.86}
      >
        {/* Search */}
        <View style={[styles.searchRow, { paddingBottom: insets.bottom > 0 ? 6 : 12 }]}>
          <Ionicons name="search-outline" size={16} color={colors.icon.muted} />
          <AppTextInput
            style={styles.searchInput}
            placeholder={t("barbershop.searchPlaceholder")}
            placeholderTextColor={colors.text.muted}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearch("")}
              hitSlop={8}
              accessibilityLabel={t("common.clear")}
            >
              <Ionicons name="close-circle" size={16} color={colors.icon.muted} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <ActivityIndicator
              size="small"
              color={colors.brand.primary}
              style={styles.loader}
            />
          ) : filtered.length === 0 ? (
            <AppText style={styles.emptyText}>
              {t("barbershop.noBarbershopFound")}
            </AppText>
          ) : (
            filtered.map((shop) => {
              const isActive =
                sessionData?.session?.activeOrganizationId === shop.id;
              const initials = shop.name
                .split(" ")
                .slice(0, 2)
                .map((w: string) => w[0])
                .join("")
                .toUpperCase();
              const unreadCount = unreadCountMap[shop.id] ?? 0;
              return (
                <TouchableOpacity
                  key={shop.id}
                  style={[styles.item, isActive && styles.itemActive]}
                  onPress={() => handleSelect(shop.id)}
                  activeOpacity={0.7}
                >
                  {shop.logoThumb ? (
                    <Image
                      source={{ uri: shop.logoThumb }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <View style={[styles.avatar, isActive && styles.avatarActive]}>
                      <AppText style={[styles.avatarText, isActive && styles.avatarTextActive]}>
                        {initials}
                      </AppText>
                    </View>
                  )}
                  <View style={styles.itemTexts}>
                    <AppText style={styles.itemName} numberOfLines={1}>
                      {shop.name}
                    </AppText>
                    <View style={styles.itemMetaRow}>
                      {shop.role ? (
                        <AppText style={styles.itemRole}>{shop.role}</AppText>
                      ) : null}
                      {!isActive && unreadCount > 0 && (
                        <AppText style={styles.unreadLabel}>
                          {t("barbershop.unreadCount", {
                            count: String(unreadCount),
                          })}
                        </AppText>
                      )}
                    </View>
                  </View>
                  {isActive && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={colors.brand.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.createRow}
          onPress={handleCreateNew}
          activeOpacity={0.7}
        >
          <View style={styles.createIcon}>
            <Ionicons name="add" size={20} color={colors.text.secondary} />
          </View>
          <View>
            <AppText style={styles.createLabel}>
              {t("barbershop.addBarbershop")}
            </AppText>
            <AppText style={styles.createSub}>
              {t("barbershop.createNewWorkspace")}
            </AppText>
          </View>
        </TouchableOpacity>
      </BottomSheet>
    </>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 4,
    marginTop: 4,
    marginBottom: 10,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    backgroundColor: c.bg.default,
    borderWidth: 1,
    borderColor: c.border.light,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: c.text.primary,
    padding: 0,
  },
  list: {
    maxHeight: 300,
  },
  loader: {
    marginVertical: 20,
  },
  emptyText: {
    fontSize: 13,
    color: c.text.muted,
    textAlign: "center",
    marginVertical: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 12,
    gap: 12,
    borderRadius: 14,
  },
  itemActive: {
    backgroundColor: c.brand.primarySurface,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: c.bg.default,
    borderWidth: 1,
    borderColor: c.border.light,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 13,
  },
  avatarActive: {
    backgroundColor: c.brand.primary,
    borderColor: "transparent",
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "600",
    color: c.text.secondary,
  },
  avatarTextActive: {
    color: c.text.primary,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: c.text.primary,
  },
  itemTexts: {
    flex: 1,
  },
  itemMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  itemRole: {
    fontSize: 11,
    fontWeight: "500",
    color: c.text.secondary,
    textTransform: "capitalize",
  },
  unreadLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: c.status.danger,
  },
  createRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: c.border.light,
    marginTop: 6,
  },
  createIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: c.bg.default,
    borderWidth: 1,
    borderColor: c.border.light,
    alignItems: "center",
    justifyContent: "center",
  },
  createLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: c.text.primary,
  },
  createSub: {
    fontSize: 12,
    color: c.text.muted,
    marginTop: 1,
  },
  switchingOverlay: {
    flex: 1,
    backgroundColor: c.bg.overlay,
    alignItems: "center",
    justifyContent: "center",
  },
  switchingCard: {
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: "center",
    gap: 12,
    backgroundColor: c.bg.elevated,
    borderWidth: 1,
    borderColor: c.border.light,
  },
  switchingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: c.text.primary,
    marginTop: 4,
  },
  switchingSubText: {
    fontSize: 13,
    color: c.text.muted,
  },
  });
