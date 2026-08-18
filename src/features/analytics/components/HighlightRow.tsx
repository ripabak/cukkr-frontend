import { Colors } from "@/src/theme/colors";
import { Neu } from "@/src/theme/styles";
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
      style={[styles.row, Neu.raised(Colors.bg.surface)]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={!onPress}
    >
      <View style={[styles.avatar, Neu.inset(Colors.bg.surface, 0.6)]}>
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
      <View style={[styles.revenueBadge, Neu.accent(0.85)]}>
        <AppText style={styles.revenueText}>{formatRupiah(revenue)}</AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    padding: 16,
    gap: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.text.secondary,
    fontWeight: "400",
  },
  revenueBadge: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  revenueText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});
