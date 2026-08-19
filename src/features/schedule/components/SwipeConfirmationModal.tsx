import { AppText } from "@/src/components/AppText";
import { BottomSheet } from "@/src/components/BottomSheet";
import { Colors } from "@/src/theme/colors";
import { haptics } from "@/src/utils/haptics";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SwipeToCompleteSlider } from "./SwipeToCompleteSlider";

interface Props {
  visible: boolean;
  title: string;
  description?: string;
  swipeLabel?: string;
  onComplete: () => void;
  onCancel?: () => void;
}

/**
 * Confirmation sheet with a swipe-to-complete action. The slider itself is the
 * shared `SwipeToCompleteSlider` — the exact same component used inline at the
 * bottom of the booking detail, so the drag behaviour is identical everywhere.
 */
export function SwipeConfirmationModal({
  visible,
  title,
  description,
  swipeLabel,
  onComplete,
  onCancel,
}: Props) {
  const { t } = useI18nContext();
  const resolvedSwipeLabel = swipeLabel ?? t("schedule.swipeToComplete");

  const handleClose = () => {
    haptics.light();
    onCancel?.();
  };

  return (
    <BottomSheet visible={visible} onClose={handleClose}>
      <View style={styles.body}>
        <View style={styles.iconWrapper}>
          <Ionicons
            name="checkmark"
            size={26}
            color={Colors.text.primary}
          />
        </View>
        <AppText style={styles.title}>{title}</AppText>
        {description ? (
          <AppText style={styles.description}>{description}</AppText>
        ) : null}

        <View style={styles.trackWrap}>
          <SwipeToCompleteSlider
            label={resolvedSwipeLabel}
            onComplete={onComplete}
          />
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: "center",
    paddingTop: 6,
    paddingBottom: 8,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: Colors.brand.primarySurface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 19,
    fontWeight: "600",
    color: Colors.text.primary,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 24,
    maxWidth: 300,
  },
  trackWrap: {
    alignSelf: "center",
    width: 280,
    marginBottom: 8,
  },
});
