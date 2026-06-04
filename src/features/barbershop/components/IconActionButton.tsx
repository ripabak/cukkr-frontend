import { Colors } from "@/src/theme/colors";
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  onPress?: () => void;
  size?: number;
  style?: ViewStyle;
}

export function IconActionButton({
  iconName,
  onPress,
  size = 48,
  style,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <Ionicons
        name={iconName}
        size={size * 0.42}
        color={Colors.text.primary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
