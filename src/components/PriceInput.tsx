import React from "react";
import { ViewStyle } from "react-native";
import { PrefixedInputField } from "@/src/components/PrefixedInputField";

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
  label?: string;
  placeholder?: string;
  editable?: boolean;
  style?: ViewStyle;
}

export function PriceInput({
  value,
  onChangeText,
  label = "Price",
  placeholder = "0",
  editable,
  style,
}: Props) {
  return (
    <PrefixedInputField
      prefix="Rp"
      value={formatPriceDisplay(value)}
      onChangeText={(text) => onChangeText(unformatPrice(text))}
      placeholder={placeholder}
      editable={editable}
      label={label}
      keyboardType="numeric"
      style={style}
    />
  );
}
