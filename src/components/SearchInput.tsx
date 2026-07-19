import { useI18nContext } from "@/src/lib/i18n/provider";
import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { AppTextInput } from "@/src/components/AppTextInput";

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export function SearchInput({
  value,
  onChangeText,
  placeholder,
  style,
}: Props) {
  const { t } = useI18nContext();
  const resolvedPlaceholder = placeholder ?? t("common.search");
  return (
    <View style={[styles.container, style]}>
      <Ionicons name="search" size={18} color={Colors.icon.muted} />
      <AppTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={resolvedPlaceholder}
        placeholderTextColor={Colors.text.muted}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.bg.surface,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text.primary,
    padding: 0,
  },
});
