import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { authTheme } from "../auth-theme";

type AuthFooterPromptProps = {
  prompt: string;
  actionLabel: string;
  href: "/login" | "/register";
};

export function AuthFooterPrompt({
  actionLabel,
  href,
  prompt,
}: AuthFooterPromptProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.prompt}>{prompt}</Text>
      <Link href={href} style={styles.link}>
        {actionLabel}
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: authTheme.spacing.xs,
  },
  prompt: {
    color: authTheme.colors.textSecondary,
    fontSize: 14,
  },
  link: {
    color: authTheme.colors.accentDark,
    fontSize: 14,
    fontWeight: "700",
  },
});