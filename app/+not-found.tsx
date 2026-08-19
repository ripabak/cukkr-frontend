import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";

export default function NotFoundScreen() {
  const styles = useThemedStyles(createStyles);
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <AppText style={styles.title}>This screen doesn't exist.</AppText>

        <Link href="/" style={styles.link}>
          <AppText style={styles.linkText}>Go to home screen!</AppText>
        </Link>
      </View>
    </>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    link: {
      marginTop: 15,
      paddingVertical: 15,
    },
    linkText: {
      fontSize: 14,
      color: c.status.info,
    },
  });
