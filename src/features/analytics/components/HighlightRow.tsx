import { Colors } from "@/src/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { formatRupiah } from "../utils/format";

interface Props {
  imageUrl: string | null;
  name: string;
  subtitle: string;
  revenue: number;
  onPress?: () => void;
  fallbackIcon?: keyof typeof Ionicons.glyphMap;
}

export function HighlightRow({
  imageUrl,
  name,
  subtitle,
  revenue,
  onPress,
  fallbackIcon = "person",
}: Props) {
  return (
    <TouchableOpacity
      style={styles.row}
      onPress={onPress}
      activeOpacity={0.75}
      disabled={!onPress}
    >
      <View style={styles.avatar}>
        {imageUrl ? (
          <Image
            source={{ uri: imageUrl }}
            style={styles.avatarImg}
            contentFit="cover"
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons
              name={fallbackIcon}
              size={20}
              color={Colors.text.secondary}
            />
          </View>
        )}
      </View>
      <View style={styles.info}>
        <AppText style={styles.name} numberOfLines={1}>
          {name}
        </AppText>
        <AppText style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </AppText>
      </View>
      <View style={styles.revenueBadge}>
        <AppText style={styles.revenueText}>{formatRupiah(revenue)}</AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.bg.default,
    borderRadius: 20,
    padding: 16,
    gap: 14,
    borderWidth: 1,
    borderColor: Colors.border.light,
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.05)",
    elevation: 2,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
  },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.text.secondary,
    fontWeight: "400",
  },
  revenueBadge: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  revenueText: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.text.primary,
  },
});
