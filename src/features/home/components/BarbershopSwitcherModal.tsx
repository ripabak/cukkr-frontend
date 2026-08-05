import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import { authClient } from "@/src/lib/auth-client";
import { useToast } from "@/src/lib/providers";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useI18nContext } from "@/src/lib/i18n/provider";
import {
  ActivityIndicator,
  Animated,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useWindowDimensions,
} from "react-native";
import { AppText } from "@/src/components/AppText";
import { AppTextInput } from "@/src/components/AppTextInput";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFrame } from "@/src/components/FrameContext";
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
  const router = useRouter();
  const toast = useToast();
  const insets = useSafeAreaInsets();
  const { frameWidth } = useFrame();
  const { width: viewportWidth } = useWindowDimensions();
  const frameOffset = (viewportWidth - frameWidth) / 2;
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

  const slideAnim = useRef(new Animated.Value(-16)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setSearch("");
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 110,
          friction: 13,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -10,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => slideAnim.setValue(-16));
    }
  }, [visible]);

  const filtered = barbershops.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (id: string) => {
    if (sessionData?.session?.activeOrganizationId === id) {
      onClose();
      return;
    }

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
    onClose();
    router.push("/d/create-barbershop-name-logo");
  };

  return (
    <>
      <Modal
        visible={isSwitchingWorkspace}
        transparent
        animationType="fade"
        statusBarTranslucent
      >
        <View style={styles.switchingOverlay}>
          <View style={[styles.switchingCard, Neu.float(Colors.bg.default, 1.2), { width: frameWidth * 0.72 }]}>
            <ActivityIndicator size="large" color={Colors.brand.primary} />
            <AppText style={styles.switchingTitle}>{t("barbershop.switchingWorkspace")}</AppText>
            <AppText style={styles.switchingSubText}>{t("barbershop.pleaseWait")}</AppText>
          </View>
        </View>
      </Modal>

      <Modal
        visible={visible && !isSwitchingWorkspace}
        transparent
        animationType="none"
        statusBarTranslucent
      >
        {/* Full-screen tap-to-close backdrop */}
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.backdrop,
              { opacity: fadeAnim },
            ]}
          />
        </TouchableWithoutFeedback>

        {/* Dropdown panel — slides down from top, covers the sticky header */}
        <Animated.View
          style={[
            styles.panel,
            Neu.float(Colors.bg.default, 1.2),
            {
              top: insets.top,
              left: frameOffset,
              right: frameOffset,
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          {/* Drag handle */}
          <View style={styles.handle} />

          {/* Search */}
          <View style={[styles.searchRow, Neu.inset(Colors.bg.surface, 0.6)]}>
            <Ionicons
              name="search-outline"
              size={16}
              color={Colors.icon.muted}
            />
            <AppTextInput
              style={styles.searchInput}
              placeholder={t("barbershop.searchPlaceholder")}
              placeholderTextColor={Colors.text.muted}
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons
                  name="close-circle"
                  size={16}
                  color={Colors.icon.muted}
                />
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
                color={Colors.brand.primary}
                style={styles.loader}
              />
            ) : filtered.length === 0 ? (
              <AppText style={styles.emptyText}>{t("barbershop.noBarbershopFound")}</AppText>
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
                    style={styles.item}
                    onPress={() => handleSelect(shop.id)}
                    activeOpacity={0.7}
                    disabled={isSwitchingWorkspace}
                  >
                    {shop.logoThumb ? (
                      <Image
                        source={{ uri: shop.logoThumb }}
                        style={[styles.avatarImage, isActive && styles.avatarActive]}
                      />
                    ) : (
                      <View
                        style={[styles.avatar, isActive && styles.avatarActive]}
                      >
                        <AppText
                          style={[
                            styles.avatarText,
                            isActive && styles.avatarTextActive,
                          ]}
                        >
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
                            {t("barbershop.unreadCount", { count: String(unreadCount) })}
                          </AppText>
                        )}
                      </View>
                    </View>
                    {isActive && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={Colors.brand.primaryDark}
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
            <View style={[styles.createIcon, Neu.inset(Colors.bg.surface, 0.6)]}>
              <Ionicons name="add" size={20} color={Colors.text.secondary} />
            </View>
            <View>
              <AppText style={styles.createLabel}>{t("barbershop.addBarbershop")}</AppText>
              <AppText style={styles.createSub}>{t("barbershop.createNewWorkspace")}</AppText>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: Colors.bg.overlay,
  },
  panel: {
    position: "absolute",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    maxHeight: 440,
    overflow: "hidden",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border.default,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.primary,
    padding: 0,
  },
  list: {
    maxHeight: 280,
  },
  loader: {
    marginVertical: 20,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.text.muted,
    textAlign: "center",
    marginVertical: 20,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: Colors.bg.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 10,
  },
  avatarActive: {
    backgroundColor: Colors.brand.primary,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text.secondary,
  },
  avatarTextActive: {
    color: Colors.text.primary,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
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
    fontWeight: "600",
    color: Colors.text.secondary,
    textTransform: "capitalize",
  },
  unreadLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.status.danger,
  },
  createRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    marginTop: 2,
  },
  createIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  createLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  createSub: {
    fontSize: 12,
    color: Colors.text.muted,
    marginTop: 1,
  },
  switchingOverlay: {
    flex: 1,
    backgroundColor: Colors.bg.overlay,
    alignItems: "center",
    justifyContent: "center",
  },
  switchingCard: {
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 40,
    alignItems: "center",
    gap: 12,
  },
  switchingTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
    marginTop: 4,
  },
  switchingSubText: {
    fontSize: 13,
    color: Colors.text.muted,
  },
});
