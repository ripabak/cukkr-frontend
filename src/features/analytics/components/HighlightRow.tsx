import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { formatRupiah } from "../utils/format";

interface Props {
  imageUrl: string | null;
  name: string;
  subtitle: string;
  revenue: number;
  onPress?: () => void;
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
}

export function HighlightRow({ imageUrl, name, subtitle, revenue, onPress, fallbackIcon = "person" }: Props) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={!onPress}
    >
      <View style={styles.avatar}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.avatarImg} contentFit="cover" />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name={fallbackIcon} size={20} color={Colors.text.secondary} />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
      </View>
      <View style={styles.revenueBadge}>
        <Text style={styles.revenueText}>{formatRupiah(revenue)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bg.default,
    borderRadius: 14,
    padding: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
  },
  avatarImg: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.bg.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  revenueBadge: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  revenueText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.text.primary,
  },
});
