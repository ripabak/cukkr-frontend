import React from "react";
import { ViewStyle } from "react-native";
import { LabeledInput } from "@/src/components/LabeledInput";
import { useI18nContext } from "@/src/lib/i18n/provider";

function formatPriceDisplay(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return parseInt(digits, 10).toLocaleString("id-ID");
}

function unformatPrice(input: string): string {
  return input.replace(/\D/g, "");
}

interface Props {
  value: string;
  onChangeText: (rawValue: string) => void;
  placeholder?: string;
  editable?: boolean;
  style?: ViewStyle;
}

export function PriceInput({
  value,
  onChangeText,
  placeholder = "0",
  editable,
  style,
}: Props) {
  const { t } = useI18nContext();
  return (
    <LabeledInput
      label={t("services.price")}
      value={formatPriceDisplay(value)}
      onChangeText={(text) => onChangeText(unformatPrice(text))}
      placeholder={placeholder}
      keyboardType="numeric"
      editable={editable}
      style={style}
    />
  );
}
