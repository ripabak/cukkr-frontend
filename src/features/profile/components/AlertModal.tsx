import { AppText } from "@/src/components/AppText";
import { BottomSheet } from "@/src/components/BottomSheet";
import { SoftPressable } from "@/src/components/SoftPressable";
import { Colors } from "@/src/theme/colors";
import { haptics } from "@/src/utils/haptics";
import React from "react";
import { StyleSheet, View } from "react-native";

interface Props {
  visible: boolean;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function AlertModal({
  visible,
  title,
  description,
  actionLabel,
  onAction,
}: Props) {
  return (
    <BottomSheet visible={visible} onClose={onAction ?? (() => {})}>
      <View style={styles.body}>
        <View style={styles.iconWrapper}>
          <AppText style={styles.iconGlyph}>i</AppText>
        </View>
        <AppText style={styles.title}>{title}</AppText>
        {description ? (
          <AppText style={styles.description}>{description}</AppText>
        ) : null}
        {actionLabel ? (
          <SoftPressable
            onPress={() => {
              haptics.medium();
              onAction?.();
            }}
            style={styles.btnWrap}
            contentStyle={styles.btn}
          >
            <AppText style={styles.btnLabel}>{actionLabel}</AppText>
          </SoftPressable>
        ) : null}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: "center",
    paddingTop: 6,
    paddingBottom: 4,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: Colors.bg.default,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  iconGlyph: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.secondary,
    lineHeight: 22,
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
  btnWrap: {
    marginTop: 24,
    height: 52,
    width: "100%",
  },
  btn: {
    backgroundColor: Colors.brand.primary,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  btnLabel: {
    color: Colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
  },
});
