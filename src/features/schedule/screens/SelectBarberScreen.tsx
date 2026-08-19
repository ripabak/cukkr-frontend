import { ScreenHeader } from "@/src/components/ScreenHeader";
import { ScreenShell } from "@/src/components/ScreenShell";
import { SearchInput } from "@/src/components/SearchInput";
import { useNewBookingForm } from "@/src/features/schedule/context/NewBookingContext";
import { useScheduleBarbers } from "@/src/features/schedule/hooks";
import { Neu } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { AppText } from "@/src/components/AppText";
import { Skeleton } from "@/src/components/Skeleton";

export function SelectBarberScreen() {
  const router = useRouter();
  const { t } = useI18nContext();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { setBarber } = useNewBookingForm();
  const [query, setQuery] = useState("");

  const { data: barbers = [], isLoading } = useScheduleBarbers(
    query || undefined,
  );

  const filtered = barbers.filter((b) =>
    b.name.toLowerCase().includes(query.toLowerCase()),
  );

  const handleSelect = (id: string, name: string, avatarUrl?: string | null) => {
    setBarber(id, name, avatarUrl);
    router.back();
  };

  return (
    <ScreenShell
      headerSlot={
        <ScreenHeader title={t("schedule.selectBarber")} onBack={() => router.back()} />
      }
      contentStyle={styles.content}
    >
      <SearchInput
        value={query}
        onChangeText={setQuery}
        placeholder={t("common.search")}
      />

      {isLoading ? (
        <View style={styles.list}>
          {[0, 1, 2, 3, 4].map((i) => (
            <View
              key={i}
              style={[styles.barberRow, Neu.raised(colors.bg.surface)]}
            >
              <Skeleton.Circle size={48} />
              <View style={{ flex: 1, gap: 8 }}>
                <Skeleton width="55%" height={14} radius={6} />
                <Skeleton width="35%" height={11} radius={6} />
              </View>
            </View>
          ))}
        </View>
      ) : !isLoading && filtered.length === 0 ? (
        <AppText style={styles.emptyText}>{t("barbers.noBarbers")}</AppText>
      ) : (
        <View style={styles.list}>
          {filtered.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              style={[styles.barberRow, Neu.raised(colors.bg.surface)]}
              onPress={() => handleSelect(item.id, item.name, item.avatarUrl)}
            >
              <View style={[styles.avatar, Neu.inset(colors.bg.surface, 0.6)]}>
                {item.avatarUrl ? (
                  <Image source={{ uri: item.avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <Ionicons name="person-outline" size={24} color={colors.icon.muted} />
                )}
              </View>
              <AppText style={styles.barberName}>{item.name}</AppText>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={colors.text.primary}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScreenShell>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
  content: {
    paddingTop: 24,
    gap: 16,
    paddingBottom: 200,
  },
  list: {
    gap: 12,
  },
  barberRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  barberName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: c.text.primary,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: "cover",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 14,
    color: c.text.secondary,
  },
  });
