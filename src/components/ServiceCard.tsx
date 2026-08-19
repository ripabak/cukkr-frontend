import { useI18nContext } from "@/src/lib/i18n/provider";
import { Neu, useThemedStyles } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import React from "react";
import { View, Image, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "@/src/components/AppText";
import { StatusBadge } from "@/src/components/StatusBadge";
import { ToggleSwitch } from "@/src/components/ToggleSwitch";

interface Props {
  name: string;
  price: number;
  discountPercent?: number;
  imageUri?: string;
  isDefault?: boolean;
  isActive?: boolean;
  onToggleActive?: (v: boolean) => void;
  style?: ViewStyle;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ServiceCard({
  name,
  price,
  discountPercent,
  imageUri,
  isDefault,
  isActive = true,
  onToggleActive,
  style,
}: Props) {
  const { t } = useI18nContext();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const finalPrice = discountPercent
    ? Math.round(price * (1 - discountPercent / 100))
    : price;

  return (
    <View style={[styles.card, Neu.raised(colors.bg.surface), style]}>
      <View style={styles.imagePlaceholder}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.imageEmpty, Neu.inset(colors.bg.surface, 0.6)]}>
            <Ionicons name="cut-outline" size={24} color={colors.icon.muted} />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <AppText style={styles.name} numberOfLines={1}>
          {name}
        </AppText>
        {discountPercent ? (
          <View style={styles.discountRow}>
            <View style={[styles.discountBadge, Neu.soft(colors.brand.primarySurface)]}>
              <AppText style={styles.discountText}>{t("services.percentOff", { percent: String(discountPercent) })}</AppText>
            </View>
            <AppText style={styles.originalPrice}>{formatPrice(price)}</AppText>
          </View>
        ) : null}
        <AppText style={styles.finalPrice}>{formatPrice(finalPrice)}</AppText>
      </View>
      <View style={styles.right}>
        {isDefault ? (
          <StatusBadge
            label={t("services.defaultService")}
            variant="default"
            style={styles.defaultBadge}
          />
        ) : null}
        {onToggleActive !== undefined ? (
          <ToggleSwitch value={isActive} onValueChange={onToggleActive} />
        ) : null}
      </View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    card: {
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 12,
    },
    imagePlaceholder: {
      width: 56,
      height: 56,
      borderRadius: 14,
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    imageEmpty: {
      width: "100%",
      height: "100%",
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    info: {
      flex: 1,
      gap: 2,
    },
    name: {
      fontSize: 15,
      fontWeight: "600",
      color: c.text.primary,
    },
    discountRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    discountBadge: {
      borderRadius: 6,
      paddingHorizontal: 5,
      paddingVertical: 2,
    },
    discountText: {
      color: c.brand.primaryDark,
      fontSize: 10,
      fontWeight: "600",
    },
    originalPrice: {
      fontSize: 12,
      color: c.text.secondary,
      textDecorationLine: "line-through",
    },
    finalPrice: {
      fontSize: 14,
      fontWeight: "500",
      color: c.text.primary,
    },
    right: {
      alignItems: "flex-end",
      gap: 8,
    },
    defaultBadge: {
      marginBottom: 4,
    },
  });
