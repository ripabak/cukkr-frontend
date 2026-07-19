import { Colors } from "@/src/theme/colors";
import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "@/src/components/AppText";
import { useI18nContext } from "@/src/lib/i18n/provider";

interface Props {
  count: number;
}

export function SelectionFooter({ count }: Props) {
  const { t } = useI18nContext();
  return (
    <View style={styles.container}>
      <AppText style={styles.label}>{t("customers.selectCustomers", { count: String(count) })}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 18,
    paddingBottom: 32,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});
