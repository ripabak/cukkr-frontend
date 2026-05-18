import { Pressable, StyleSheet, Text, View } from "react-native";

import { authTheme } from "../auth-theme";

type AuthFooterPromptProps = {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
};

export function AuthFooterPrompt({ prompt, actionLabel, onPress }: AuthFooterPromptProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.prompt}>{prompt}</Text>
      <Pressable onPress={onPress}>
        <Text style={styles.link}>{actionLabel}</Text>
      </Pressable>
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
