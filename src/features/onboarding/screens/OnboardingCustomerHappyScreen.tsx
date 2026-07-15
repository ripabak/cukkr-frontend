import { Colors } from "@/src/theme/colors";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { OnboardingButton } from "../components/OnboardingButton";
import { OnboardingCard } from "../components/OnboardingCard";
import { OnboardingContainer } from "../components/OnboardingContainer";
import { OnboardingIndicator } from "../components/OnboardingIndicator";
import { OnboardingTheme } from "../onboarding-theme";
import { useOnboardingStore } from "../stores/onboardingStore";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export function OnboardingCustomerHappyScreen() {
  const router = useRouter();
  const markOnboardingSeen = useOnboardingStore((s) => s.markOnboardingSeen);

  return (
    <OnboardingContainer style={styles.container}>
      <View style={styles.content}>
        <OnboardingCard style={styles.card}>
          <View style={styles.illustration}>
            {/* Customer and barber illustration placeholder */}
            <View style={styles.figureLeft}>
              <View style={styles.figureHead} />
              <View style={styles.figureBody} />
              <View style={styles.phone} />
            </View>
            <View style={styles.checkmarkArea}>
              <View style={styles.checkCircle}>
                <View style={styles.checkInner} />
              </View>
              <View style={styles.arrowUp} />
            </View>
            <View style={styles.figureRight}>
              <View style={styles.figureHead} />
              <View style={[styles.figureBody, styles.figureBodyDark]} />
              <View style={styles.comb} />
            </View>
          </View>
        </OnboardingCard>

        <OnboardingIndicator current={2} total={3} />

        <View style={styles.textContent}>
          <AppText style={styles.heading}>Customer Happy,{"\n"}Barber Happy</AppText>
          <AppText style={styles.body}>
            Smooth bookings for customers, clear schedules{"\n"}
            for barbers.{"\n"}
            Everyone knows what to do, every day.
          </AppText>
        </View>

        <View style={styles.spacer} />

        <OnboardingButton
          label="Get Started"
          onPress={() => {
            markOnboardingSeen();
            router.replace("/d/login");
          }}
          variant="secondary"
          style={styles.button}
        />
      </View>
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bg.default,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: OnboardingTheme.spacing.lg,
    paddingBottom: OnboardingTheme.spacing.xl,
  },
  card: {
    height: SCREEN_HEIGHT * 0.42,
    minHeight: 0,
    width: "100%",
    maxWidth: undefined,
    overflow: "hidden",
  },
  illustration: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    padding: OnboardingTheme.spacing.md,
    backgroundColor: Colors.brand.primarySurface,
    borderRadius: OnboardingTheme.borderRadius.lg,
    margin: OnboardingTheme.spacing.xs,
  },
  figureLeft: {
    alignItems: "center",
    gap: 4,
  },
  figureRight: {
    alignItems: "center",
    gap: 4,
  },
  figureHead: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: OnboardingTheme.colors.dark,
    opacity: 0.15,
  },
  figureBody: {
    width: 44,
    height: 80,
    borderRadius: OnboardingTheme.borderRadius.md,
    backgroundColor: OnboardingTheme.colors.dark,
    opacity: 0.2,
  },
  figureBodyDark: {
    opacity: 0.5,
  },
  phone: {
    width: 24,
    height: 40,
    borderRadius: 6,
    backgroundColor: OnboardingTheme.colors.primary,
  },
  comb: {
    width: 24,
    height: 20,
    borderRadius: 4,
    backgroundColor: OnboardingTheme.colors.dark,
    opacity: 0.4,
  },
  checkmarkArea: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: OnboardingTheme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkInner: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: OnboardingTheme.colors.dark,
    backgroundColor: "transparent",
  },
  arrowUp: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderRightWidth: 12,
    borderBottomWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: OnboardingTheme.colors.primary,
  },
  textContent: {
    marginTop: OnboardingTheme.spacing.xl,
    alignItems: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: OnboardingTheme.colors.textDark,
    textAlign: "center",
    marginBottom: OnboardingTheme.spacing.sm,
  },
  body: {
    fontSize: 14,
    color: OnboardingTheme.colors.textGray,
    textAlign: "center",
    lineHeight: 22,
  },
  spacer: {
    flex: 1,
  },
  button: {
    marginTop: 0,
  },
});
