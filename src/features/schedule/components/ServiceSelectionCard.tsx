import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { AppText } from "@/src/components/AppText";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ServiceItem {
  name: string;
  price: number;
  isDefault?: boolean;
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
  return (
    <View style={[styles.wrapper, style]}>
      <AppText style={styles.sectionLabel}>
        Service
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
          <AppText style={styles.emptyText}>Select a service</AppText>
        </TouchableOpacity>
      ) : (
        <>
          {services.map((svc, idx) => (
            <View key={idx} style={styles.serviceRow}>
              <View style={styles.imagePlaceholder} />
              <View style={styles.serviceInfo}>
                <AppText style={styles.serviceName}>{svc.name}</AppText>
                <AppText style={styles.servicePrice}>
                  {formatPrice(svc.price)}
                </AppText>
              </View>
              {svc.isDefault ? (
                <View style={styles.defaultBadge}>
                  <AppText style={styles.defaultText}>Default</AppText>
                </View>
              ) : null}
            </View>
          ))}
          <TouchableOpacity
            onPress={onSelectPress}
            activeOpacity={0.7}
            style={styles.changeRow}
          >
            <AppText style={styles.changeText}>Change service</AppText>
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
