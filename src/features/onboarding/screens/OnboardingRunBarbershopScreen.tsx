import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { OnboardingButton } from "../components/OnboardingButton";
import { OnboardingCard } from "../components/OnboardingCard";
import { OnboardingContainer } from "../components/OnboardingContainer";
import { OnboardingIndicator } from "../components/OnboardingIndicator";
import { OnboardingTheme } from "../onboarding-theme";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export function OnboardingRunBarbershopScreen() {
  const router = useRouter();

  return (
    <OnboardingContainer style={styles.container}>
      <View style={styles.content}>
        <OnboardingCard style={styles.card}>
          <View style={styles.illustration}>
            {/* Barber with tablet illustration placeholder */}
            <View style={styles.bgBlock} />
            <View style={styles.figureArea}>
              <View style={styles.figure} />
              <View style={styles.tablet}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.tabletRow,
                      i % 2 === 0 && styles.tabletRowAccent,
                    ]}
                  />
                ))}
              </View>
            </View>
            <View style={styles.checkmarks}>
              {[true, false, true].map((checked, i) => (
                <View key={i} style={styles.checkRow}>
                  <View
                    style={[styles.checkIcon, checked && styles.checkIconActive]}
                  />
                  <View style={styles.checkBar} />
                </View>
              ))}
            </View>
          </View>
        </OnboardingCard>

        <OnboardingIndicator current={1} total={3} />

        <View style={styles.textContent}>
          <Text style={styles.heading}>
            Run Your Barbershop{"\n"}with Full Control
          </Text>
          <Text style={styles.body}>
            Manage bookings, walk-ins, barbers, and services{"\n"}
            in one system.{"\n"}
            Everything is structured, nothing gets missed.
          </Text>
        </View>

        <View style={styles.spacer} />

        <OnboardingButton
          label="Next"
          onPress={() => router.push("/onboarding-customer-happy")}
          style={styles.button}
        />
      </View>
    </OnboardingContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F4E8",
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
    backgroundColor: OnboardingTheme.colors.primary,
    borderRadius: OnboardingTheme.borderRadius.lg,
    margin: OnboardingTheme.spacing.xs,
    padding: OnboardingTheme.spacing.md,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: OnboardingTheme.spacing.md,
  },
  bgBlock: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: OnboardingTheme.colors.primary,
    borderRadius: OnboardingTheme.borderRadius.lg,
  },
  figureArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: OnboardingTheme.spacing.xs,
  },
  figure: {
    width: 60,
    height: 120,
    backgroundColor: OnboardingTheme.colors.dark,
    borderRadius: OnboardingTheme.borderRadius.lg,
  },
  tablet: {
    width: 80,
    backgroundColor: OnboardingTheme.colors.white,
    borderRadius: OnboardingTheme.borderRadius.md,
    padding: 6,
    gap: 4,
  },
  tabletRow: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E0E0E0",
  },
  tabletRowAccent: {
    backgroundColor: OnboardingTheme.colors.dark,
  },
  checkmarks: {
    gap: OnboardingTheme.spacing.sm,
    justifyContent: "center",
    marginBottom: OnboardingTheme.spacing.md,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: OnboardingTheme.colors.dark,
    backgroundColor: "transparent",
  },
  checkIconActive: {
    backgroundColor: OnboardingTheme.colors.dark,
  },
  checkBar: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: OnboardingTheme.colors.dark,
    opacity: 0.7,
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
