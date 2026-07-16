import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";

import { authTheme } from "../auth-theme";

type AuthFooterPromptProps = {
  prompt: string;
  actionLabel: string;
  onPress: () => void;
};

export function AuthFooterPrompt({
  prompt,
  actionLabel,
  onPress,
}: AuthFooterPromptProps) {
  return (
    <View style={styles.row}>
      <AppText style={styles.prompt}>{prompt}</AppText>
      <Pressable onPress={onPress}>
        <AppText style={styles.link}>{actionLabel}</AppText>
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
