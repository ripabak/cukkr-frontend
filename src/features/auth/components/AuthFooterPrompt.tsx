import { Pressable, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";

import { authSpacing } from "../auth-theme";

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
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.row}>
      <AppText style={styles.prompt}>{prompt}</AppText>
      <Pressable onPress={onPress}>
        <AppText style={styles.link}>{actionLabel}</AppText>
      </Pressable>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: authSpacing.xs,
    },
    prompt: {
      color: c.text.secondary,
      fontSize: 14,
    },
    link: {
      color: c.brand.primaryDark,
      fontSize: 14,
      fontWeight: "600",
    },
  });
