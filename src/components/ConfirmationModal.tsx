import { AppText } from "@/src/components/AppText";
import { BottomSheet } from "@/src/components/BottomSheet";
import { useFrame } from "@/src/components/FrameContext";
import { SoftPressable } from "@/src/components/SoftPressable";
import { Colors } from "@/src/theme/colors";
import { haptics } from "@/src/utils/haptics";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  visible: boolean;
  icon?: string;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/**
 * Confirmation dialog presented as a gesture drag-to-dismiss bottom sheet.
 * Drag down, tap the scrim, or hit the buttons — every path animates out.
 */
export function ConfirmationModal({
  visible,
  icon,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: Props) {
  const { frameWidth } = useFrame();
  const hasBoth = !!confirmLabel && !!cancelLabel;

  const handleDismiss = () => {
    // Drag / scrim dismiss has "cancel" semantics.
    onCancel?.();
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={handleDismiss}
      showHandle={false}
    >
      <View style={[styles.content, { maxWidth: frameWidth - 40 }]}>
        {icon ? (
          <View style={styles.iconWrapper}>
            <Ionicons
              name={icon as React.ComponentProps<typeof Ionicons>["name"]}
              size={26}
              color={Colors.brand.primary}
            />
          </View>
        ) : null}

        <AppText style={styles.title}>{title}</AppText>
        {description ? (
          <AppText style={styles.description}>{description}</AppText>
        ) : null}

        <View style={[styles.buttons, hasBoth && styles.buttonsStack]}>
          {confirmLabel ? (
            <SoftPressable
              onPress={() => {
                haptics.medium();
                onConfirm?.();
              }}
              style={styles.btn}
              contentStyle={styles.btnPrimary}
            >
              <AppText style={styles.btnPrimaryLabel}>{confirmLabel}</AppText>
            </SoftPressable>
          ) : null}
          {cancelLabel ? (
            <SoftPressable
              onPress={() => {
                haptics.light();
                onCancel?.();
              }}
              style={styles.btn}
              contentStyle={styles.btnSecondary}
            >
              <AppText style={styles.btnSecondaryLabel}>{cancelLabel}</AppText>
            </SoftPressable>
          ) : null}
        </View>
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    alignSelf: "center",
    width: "100%",
    alignItems: "center",
    paddingTop: 6,
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
    textAlign: "center",
    color: Colors.text.primary,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    maxWidth: 300,
  },
  buttons: {
    marginTop: 24,
    gap: 12,
    width: "100%",
  },
  buttonsStack: {
    marginBottom: 4,
  },
  btn: {
    height: 54,
    width: "100%",
  },
  btnPrimary: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryLabel: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  btnSecondary: {
    backgroundColor: Colors.bg.surface,
    borderWidth: 1,
    borderColor: Colors.border.default,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  btnSecondaryLabel: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "500",
  },
});
