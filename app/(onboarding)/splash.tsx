import { OnboardingContainer } from "@/src/features/onboarding/components/OnboardingContainer";
import { OnboardingTheme } from "@/src/features/onboarding/onboarding-theme";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function OnboardingSplashScreen() {
  const router = useRouter();

  // Auto navigate after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/feature-1");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <OnboardingContainer>
      <View style={styles.content}>
        <Text style={styles.logo}>Cukkr</Text>
        <Text style={styles.subtitle}>Your Barbershop, Simplified</Text>
      </View>
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: 48,
    fontWeight: "700",
    color: OnboardingTheme.colors.white,
    marginBottom: OnboardingTheme.spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: OnboardingTheme.colors.primary,
    fontWeight: "500",
  },
});
