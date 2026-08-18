import { AppText } from "@/src/components/AppText";
import { BottomSheet } from "@/src/components/BottomSheet";
import { SoftPressable } from "@/src/components/SoftPressable";
import { Colors } from "@/src/theme/colors";
import { haptics } from "@/src/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useFrame } from "@/src/components/FrameContext";
import { useI18nContext } from "@/src/lib/i18n/provider";

interface Props {
  visible: boolean;
  onClose: () => void;
}

/**
 * "New booking" action sheet: pick Walk-in or Appointment.
 * Gesture drag-to-dismiss via the shared BottomSheet.
 */
export function NewBookBottomSheet({ visible, onClose }: Props) {
  const router = useRouter();
  const { t } = useI18nContext();
  const { frameWidth } = useFrame();

  const go = (href: "/d/new-walk-in" | "/d/new-appointment", action: "medium" | "success" = "medium") => {
    haptics[action]();
    onClose();
    router.push(href);
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={t("home.newBooking")}
      subtitle={t("home.newBookingHint")}
    >
      <View style={styles.sheetBody}>
        <View style={[styles.optionsRow, { maxWidth: frameWidth - 40 }]}>
          <SoftPressable
            onPress={() => go("/d/new-walk-in")}
            style={styles.option}
            contentStyle={styles.optionSurface}
          >
            <View style={[styles.iconChip, styles.walkInChip]}>
              <Ionicons name="walk-outline" size={24} color={Colors.status.inProgress} />
            </View>
            <AppText style={styles.optionLabel}>{t("bookings.walkIn")}</AppText>
            <AppText style={styles.optionHint} numberOfLines={2}>
              {t("home.walkInHint")}
            </AppText>
          </SoftPressable>

          <SoftPressable
            onPress={() => go("/d/new-appointment", "success")}
            style={styles.option}
            contentStyle={styles.optionSurface}
          >
            <View style={[styles.iconChip, styles.apptChip]}>
              <Ionicons
                name="calendar-outline"
                size={24}
                color={Colors.status.info}
              />
            </View>
            <AppText style={styles.optionLabel}>{t("bookings.appointment")}</AppText>
            <AppText style={styles.optionHint} numberOfLines={2}>
              {t("home.appointmentHint")}
            </AppText>
          </SoftPressable>
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  sheetBody: {
    paddingVertical: 4,
    paddingBottom: 8,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 12,
    alignSelf: "center",
    width: "100%",
  },
  option: {
    flex: 1,
    minHeight: 132,
  },
  optionSurface: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: Colors.bg.surface,
    borderWidth: 1,
    borderColor: Colors.border.light,
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 8,
  },
  iconChip: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  walkInChip: {
    backgroundColor: Colors.status.inProgressSurface,
  },
  apptChip: {
    backgroundColor: Colors.status.infoSurface,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text.primary,
    letterSpacing: -0.2,
  },
  optionHint: {
    fontSize: 12,
    color: Colors.text.muted,
    lineHeight: 16,
  },
});
