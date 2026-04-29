import { OnboardingButton } from "@/src/features/onboarding/components/OnboardingButton";
import { OnboardingCard } from "@/src/features/onboarding/components/OnboardingCard";
import { OnboardingContainer } from "@/src/features/onboarding/components/OnboardingContainer";
import { OnboardingIndicator } from "@/src/features/onboarding/components/OnboardingIndicator";
import { OnboardingTheme } from "@/src/features/onboarding/onboarding-theme";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function OnboardingFeature3Screen() {
  const router = useRouter();

  const handleGetStarted = () => {
    // Navigate to login after onboarding
    router.push("/login");
  };

  return (
    <OnboardingContainer>
      <OnboardingCard>
        {/* Placeholder for illustration */}
        <View style={styles.illustration}>
          <Text style={styles.illustrationText}>✅</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Customer Happy, Barber Happy</Text>
          <Text style={styles.description}>
            Smooth bookings for customers, clear schedules for barbers.
            Everyone knows what to do, every day.
          </Text>
        </View>

        {/* Navigation */}
        <View style={styles.footer}>
          <OnboardingIndicator current={3} total={4} />
          <OnboardingButton
            label="Get Started"
            onPress={handleGetStarted}
            variant="secondary"
          />
        </View>
      </OnboardingCard>
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  illustration: {
    width: 140,
    height: 140,
    backgroundColor: "#C6FF4D",
    borderRadius: OnboardingTheme.borderRadius.lg,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: OnboardingTheme.spacing.lg,
  },
  illustrationText: {
    fontSize: 60,
  },
  content: {
    alignItems: "center",
    marginBottom: OnboardingTheme.spacing.lg,
  },
  title: {
    fontSize: OnboardingTheme.typography.subheading.fontSize,
    fontWeight: "600",
    color: OnboardingTheme.colors.textDark,
    textAlign: "center",
    marginBottom: OnboardingTheme.spacing.md,
  },
  description: {
    fontSize: OnboardingTheme.typography.body.fontSize,
    color: OnboardingTheme.colors.textGray,
    textAlign: "center",
    lineHeight: 22,
  },
  footer: {
    width: "100%",
  },
});
