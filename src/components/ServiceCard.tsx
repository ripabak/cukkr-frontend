import { useI18nContext } from "@/src/lib/i18n/provider";
import { Colors } from "@/src/theme/colors";
import React from "react";
import { View, Image, StyleSheet, ViewStyle } from "react-native";
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
  const finalPrice = discountPercent
    ? Math.round(price * (1 - discountPercent / 100))
    : price;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.imagePlaceholder}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imageEmpty} />
        )}
      </View>
      <View style={styles.info}>
        <AppText style={styles.name} numberOfLines={1}>
          {name}
        </AppText>
        {discountPercent ? (
          <View style={styles.discountRow}>
            <View style={styles.discountBadge}>
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.brand.primarySurface,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  imagePlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 8,
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
    backgroundColor: Colors.brand.primaryDark,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  discountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  discountBadge: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  discountText: {
    color: Colors.text.primary,
    fontSize: 10,
    fontWeight: "700",
  },
  originalPrice: {
    fontSize: 12,
    color: Colors.text.secondary,
    textDecorationLine: "line-through",
  },
  finalPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  right: {
    alignItems: "flex-end",
    gap: 8,
  },
  defaultBadge: {
    marginBottom: 4,
  },
});
