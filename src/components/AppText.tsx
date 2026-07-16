import { Text, type TextProps } from "react-native";

const fontWeightToFamily: Record<string, string> = {
  "400": "PlusJakartaSans_400Regular",
  "500": "PlusJakartaSans_500Medium",
  "600": "PlusJakartaSans_600SemiBold",
  "700": "PlusJakartaSans_700Bold",
  "800": "PlusJakartaSans_700Bold",
};

export function AppText({ style, ...props }: TextProps) {
  const flattened = Array.isArray(style) ? Object.assign({}, ...style) : style;
  const weight =
    flattened && "fontWeight" in flattened
      ? String(flattened.fontWeight)
      : "400";
  const fontFamily = flattened && "fontFamily" in flattened
    ? flattened.fontFamily
    : fontWeightToFamily[weight] ?? fontWeightToFamily["400"];

  return <Text style={[{ fontFamily }, style]} {...props} />;
}
