import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import { AppTheme } from "@/src/app-theme";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  visible: boolean;
  onClose: () => void;
}

export function IOSInstallModal({ visible, onClose }: Props) {
  if (Platform.OS !== "web") return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <Text style={styles.title}>Install Cukkr</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={8}
            >
              <Ionicons name="close" size={20} color={AppTheme.colors.gray} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>
            Add Cukkr to your home screen for faster access.
          </Text>

          <View style={styles.step}>
            <View style={styles.stepIcon}>
              <Ionicons
                name="share-outline"
                size={22}
                color={AppTheme.colors.accent}
              />
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>Tap the Share button</Text>
              <Text style={styles.stepDesc}>
                At the bottom of Safari browser, tap the share icon (box with
                arrow up).
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.step}>
            <View style={styles.stepIcon}>
              <Ionicons
                name="square-outline"
                size={22}
                color={AppTheme.colors.accent}
              />
            </View>
            <View style={styles.stepText}>
              <Text style={styles.stepTitle}>Select "Add to Home Screen"</Text>
              <Text style={styles.stepDesc}>
                Scroll down and tap "Add to Home Screen", then tap "Add".
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.doneBtn} onPress={onClose}>
            <Text style={styles.doneBtnText}>Got it</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: AppTheme.spacing.xl,
    paddingBottom: 36,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: AppTheme.colors.border,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: AppTheme.colors.dark,
  },
  closeBtn: {
    padding: 4,
  },
  subtitle: {
    fontSize: 14,
    color: AppTheme.colors.gray,
    marginBottom: 24,
    lineHeight: 20,
  },
  step: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 16,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: AppTheme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  stepText: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: AppTheme.colors.dark,
    marginBottom: 4,
  },
  stepDesc: {
    fontSize: 13,
    color: AppTheme.colors.gray,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: AppTheme.colors.border,
    marginBottom: 16,
  },
  doneBtn: {
    marginTop: 8,
    backgroundColor: AppTheme.colors.accent,
    paddingVertical: 14,
    borderRadius: AppTheme.borderRadius.lg,
    alignItems: "center",
  },
  doneBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
  },
});
