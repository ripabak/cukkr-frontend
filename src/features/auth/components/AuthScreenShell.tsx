import type { PropsWithChildren, ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

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
          <View style={styles.card}>
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
            </View>

            <View style={styles.content}>{children}</View>

            {footer ? <View style={styles.footer}>{footer}</View> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: authTheme.colors.pageBackground,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: authTheme.spacing.lg,
    paddingVertical: authTheme.spacing.xl,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    backgroundColor: authTheme.colors.cardBackground,
    borderRadius: authTheme.radius.card,
    paddingHorizontal: authTheme.spacing.xl,
    paddingVertical: 40,
  },
  header: {
    gap: authTheme.spacing.sm,
    marginBottom: authTheme.spacing.xl,
  },
  title: {
    color: authTheme.colors.textPrimary,
    fontSize: 34,
    fontWeight: "800",
    textAlign: "center",
  },
  description: {
    color: authTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  content: {
    gap: authTheme.spacing.md,
  },
  footer: {
    marginTop: authTheme.spacing.lg,
  },
});