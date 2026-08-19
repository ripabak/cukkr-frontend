import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import React from "react";
import { View, StyleSheet } from "react-native";
import { AppText } from "@/src/components/AppText";
import { useI18nContext } from "@/src/lib/i18n/provider";

interface Props {
  count: number;
}

export function SelectionFooter({ count }: Props) {
  const { t } = useI18nContext();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  return (
    <View style={styles.container}>
      <AppText style={styles.label}>{t("customers.selectCustomers", { count: String(count) })}</AppText>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
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
      fontWeight: "500",
      color: c.text.primary,
    },
  });
