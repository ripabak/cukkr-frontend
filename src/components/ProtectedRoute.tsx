import { useAuthGuard } from "@/src/hooks/useAuthGuard";
import { useThemedStyles } from "@/src/theme/styles";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { ActivityIndicator, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, isAuthenticated } = useAuthGuard();
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (isLoading || !isAuthenticated) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={colors.brand.primary} />
      </SafeAreaView>
    );
  }

  return <>{children}</>;
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: c.bg.default,
    },
  });
