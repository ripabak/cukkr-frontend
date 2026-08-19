import type { PropsWithChildren, ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { AppText } from "@/src/components/AppText";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";

import { authSpacing } from "../auth-theme";

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
  const styles = useThemedStyles(createStyles);

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

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    page: {
      flex: 1,
      backgroundColor: c.bg.default,
    },
    keyboardAvoidingView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: authSpacing.xl,
      paddingVertical: authSpacing.xl,
    },
    header: {
      gap: authSpacing.sm,
      marginBottom: authSpacing.xl,
    },
    title: {
      color: c.text.primary,
      fontSize: 32,
      fontWeight: "700",
      fontFamily: "PlusJakartaSans_700Bold",
      letterSpacing: -0.8,
    },
    description: {
      color: c.text.secondary,
      fontSize: 15,
      lineHeight: 22,
      fontFamily: "PlusJakartaSans_400Regular",
    },
    content: {
      gap: authSpacing.md,
    },
    footer: {
      marginTop: authSpacing.lg,
    },
  });
