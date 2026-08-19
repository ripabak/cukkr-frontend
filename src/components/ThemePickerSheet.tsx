import { AppText } from "@/src/components/AppText";
import { BottomSheet } from "@/src/components/BottomSheet";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { haptics } from "@/src/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const MODES = ["light", "dark", "system"] as const;

/**
 * Bottom sheet to pick the display theme (Light / Dark / System).
 * Reused from the Profile page and the login screen ("post-login" picker).
 */
export function ThemePickerSheet({ visible, onClose }: Props) {
  const { t } = useI18nContext();
  const { mode, setMode } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

  const labelOf = (m: (typeof MODES)[number]) =>
    m === "light"
      ? t("profile.themeLight")
      : m === "dark"
        ? t("profile.themeDark")
        : t("profile.themeSystem");

  const descOf = (m: (typeof MODES)[number]) =>
    m === "light"
      ? t("profile.themeLightDesc")
      : m === "dark"
        ? t("profile.themeDarkDesc")
        : t("profile.themeSystemDesc");

  const iconOf = (
    m: (typeof MODES)[number],
  ): React.ComponentProps<typeof Ionicons>["name"] =>
    m === "light" ? "sunny" : m === "dark" ? "moon" : "phone-portrait";

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={t("profile.themeMode")}
      subtitle={t("profile.appearance")}
    >
      <View style={styles.list}>
        {MODES.map((m) => {
          const selected = mode === m;
          return (
            <Pressable
              key={m}
              onPress={() => {
                haptics.light();
                setMode(m);
                onClose();
              }}
              style={({ pressed }) => [
                styles.row,
                selected ? styles.rowSelected : null,
                pressed ? styles.rowPressed : null,
              ]}
            >
              <View
                style={[
                  styles.iconCircle,
                  selected ? styles.iconCircleSelected : null,
                ]}
              >
                <Ionicons
                  name={iconOf(m)}
                  size={18}
                  color={selected ? colors.text.inverse : colors.icon.muted}
                />
              </View>

              <View style={styles.textCol}>
                <AppText style={styles.label}>{labelOf(m)}</AppText>
                <AppText style={styles.desc}>{descOf(m)}</AppText>
              </View>

              {selected ? (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={colors.brand.primary}
                />
              ) : (
                <Ionicons
                  name="ellipse-outline"
                  size={20}
                  color={colors.border.default}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </BottomSheet>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    list: {
      gap: 10,
      paddingTop: 4,
      paddingBottom: 8,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 14,
      paddingVertical: 13,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border.light,
      backgroundColor: c.bg.surface,
    },
    rowSelected: {
      borderColor: c.brand.primary,
      backgroundColor: c.brand.primarySurface,
    },
    rowPressed: {
      opacity: 0.85,
    },
    iconCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: c.bg.cream,
    },
    iconCircleSelected: {
      backgroundColor: c.brand.primary,
    },
    textCol: {
      flex: 1,
      gap: 2,
    },
    label: {
      fontSize: 15,
      fontWeight: "600",
      color: c.text.primary,
    },
    desc: {
      fontSize: 13,
      color: c.text.secondary,
    },
  });
