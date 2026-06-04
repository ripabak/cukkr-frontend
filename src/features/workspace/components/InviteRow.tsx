import { Colors } from "@/src/theme/colors";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  email: string;
  onRemove?: () => void;
  style?: ViewStyle;
}

export function InviteRow({ email, onRemove, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.dot} />
      <Text style={styles.email}>{email}</Text>
      <TouchableOpacity
        onPress={onRemove}
        activeOpacity={0.7}
        style={styles.removeButton}
      >
        <Ionicons name="close" size={14} color={Colors.text.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bg.default,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border.default,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.brand.primary,
  },
  email: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
    marginLeft: 10,
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.status.danger,
    alignItems: "center",
    justifyContent: "center",
  },
});
