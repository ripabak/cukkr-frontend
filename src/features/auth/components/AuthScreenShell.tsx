import type { PropsWithChildren, ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { AppText } from "@/src/components/AppText";

import { authTheme } from "../auth-theme";

type AuthScreenShellProps = PropsWithChildren<{
  title: string;
  description: string;
  footer?: ReactNode;
}>;

export function AuthScreenShell({
  children,
  description,
  footer,
  title,
}: AuthScreenShellProps) {
  return (
    <View style={styles.page}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", default: undefined })}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          bounces={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <AppText style={styles.title}>{title}</AppText>
            <AppText style={styles.description}>{description}</AppText>
          </View>

          <View style={styles.content}>{children}</View>

          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: authTheme.colors.cardBackground,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: authTheme.spacing.xl,
    paddingVertical: authTheme.spacing.xl,
  },
  header: {
    gap: authTheme.spacing.sm,
    marginBottom: authTheme.spacing.xl,
  },
  title: {
    color: authTheme.colors.textPrimary,
    fontSize: 34,
    fontWeight: "800",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  description: {
    color: authTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  content: {
    gap: authTheme.spacing.md,
  },
  footer: {
    marginTop: authTheme.spacing.lg,
  },
});
