import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { AppText } from "@/src/components/AppText";
import { useI18nContext } from "@/src/lib/i18n/provider";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ServiceItem {
  name: string;
  price: number;
  isDefault?: boolean;
  imageThumb?: string | null;
}

interface Props {
  services: ServiceItem[];
  onSelectPress?: () => void;
  style?: ViewStyle;
  required?: boolean;
}

function formatPrice(amount: number): string {
  return `Rp. ${amount.toLocaleString("id-ID")}`;
}

export function ServiceSelectionCard({
  services,
  onSelectPress,
  style,
  required,
}: Props) {
  const { t } = useI18nContext();
  return (
    <View style={[styles.wrapper, style]}>
      <AppText style={styles.sectionLabel}>
        {t("bookings.services")}
        {required ? <AppText style={styles.asterisk}> *</AppText> : null}
      </AppText>
      {services.length === 0 ? (
        <TouchableOpacity
          onPress={onSelectPress}
          activeOpacity={0.7}
          style={styles.emptyRow}
        >
          <Ionicons
            name="add-circle-outline"
            size={18}
            color={Colors.icon.muted}
          />
          <AppText style={styles.emptyText}>{t("services.selectService")}</AppText>
        </TouchableOpacity>
      ) : (
        <>
          {services.map((svc, idx) => (
            <View key={idx} style={styles.serviceRow}>
              {svc.imageThumb ? (
                <Image source={{ uri: svc.imageThumb }} style={styles.serviceImage} />
              ) : (
                <View style={styles.imagePlaceholder} />
              )}
              <View style={styles.serviceInfo}>
                <AppText style={styles.serviceName}>{svc.name}</AppText>
                <AppText style={styles.servicePrice}>
                  {formatPrice(svc.price)}
                </AppText>
              </View>
              {svc.isDefault ? (
                <View style={styles.defaultBadge}>
                  <AppText style={styles.defaultText}>{t("services.defaultService")}</AppText>
                </View>
              ) : null}
            </View>
          ))}
          <TouchableOpacity
            onPress={onSelectPress}
            activeOpacity={0.7}
            style={styles.changeRow}
          >
            <AppText style={styles.changeText}>{t("services.changeService")}</AppText>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: 20,
    padding: 16,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 12,
    color: Colors.icon.muted,
    marginBottom: 2,
  },
  asterisk: {
    color: Colors.status.danger,
  },
  emptyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.text.muted,
  },
  serviceRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.brand.primary,
    borderRadius: 12,
    padding: 10,
    gap: 12,
  },
  imagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: Colors.bg.surface,
  },
  serviceImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    resizeMode: "cover",
  },
  serviceInfo: {
    flex: 1,
    gap: 2,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  defaultBadge: {
    borderWidth: 1,
    borderColor: Colors.text.primary,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  defaultText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  changeRow: {
    alignSelf: "flex-end",
  },
  changeText: {
    fontSize: 13,
    color: Colors.text.secondary,
    textDecorationLine: "underline",
  },
});
