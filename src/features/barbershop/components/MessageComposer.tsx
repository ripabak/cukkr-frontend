import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { AppTextInput } from "@/src/components/AppTextInput";
import { useI18nContext } from "@/src/lib/i18n/provider";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export function MessageComposer({
  value,
  onChangeText,
  placeholder,
  style,
}: Props) {
  const { t } = useI18nContext();
  const resolvedPlaceholder = placeholder ?? t("customers.messagePlaceholder");
  return (
    <View style={[styles.container, Neu.inset(Colors.bg.surface, 0.6), style]}>
      <AppTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={resolvedPlaceholder}
        placeholderTextColor={Colors.text.muted}
        multiline
        textAlignVertical="top"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
  },
  input: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 22,
    flex: 1,
    minHeight: 88,
  },
});
