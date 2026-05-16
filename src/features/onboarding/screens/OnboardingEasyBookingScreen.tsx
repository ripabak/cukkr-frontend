import { Colors } from '@/src/theme/colors';
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { OnboardingButton } from "../components/OnboardingButton";
import { OnboardingCard } from "../components/OnboardingCard";
import { OnboardingContainer } from "../components/OnboardingContainer";
import { OnboardingIndicator } from "../components/OnboardingIndicator";
import { OnboardingTheme } from "../onboarding-theme";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export function OnboardingEasyBookingScreen() {
  const router = useRouter();

  return (
    <OnboardingContainer style={styles.container}>
      <View style={styles.content}>
        <OnboardingCard style={styles.card}>
          <View style={styles.illustration}>
            {/* Booking calendar illustration placeholder */}
            <View style={styles.calendarGrid}>
              {Array.from({ length: 20 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.calendarCell,
                    i % 3 === 0 && styles.calendarCellAccent,
                  ]}
                />
              ))}
            </View>
            <View style={styles.calendarSide}>
              {Array.from({ length: 5 }).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.sideCell,
                    i % 2 === 0 && styles.sideCellAccent,
                  ]}
                />
              ))}
            </View>
          </View>
        </OnboardingCard>

        <OnboardingIndicator current={0} total={3} />

        <View style={styles.textContent}>
          <Text style={styles.heading}>Easy Booking with One Link</Text>
          <Text style={styles.body}>
            Share your booking link on social media.{"\n"}
            Customers book by themselves — no chat,{"\n"}
            no back-and-forth.
          </Text>
        </View>

        <View style={styles.spacer} />

        <OnboardingButton
          label="Love it"
          onPress={() => router.push("/d/onboarding-run-barbershop")}
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
    gap: OnboardingTheme.spacing.xs,
    padding: OnboardingTheme.spacing.md,
  },
  calendarGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    alignContent: "flex-start",
    paddingTop: 8,
  },
  calendarCell: {
    width: 28,
    height: 22,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: OnboardingTheme.colors.dark,
    backgroundColor: "transparent",
  },
  calendarCellAccent: {
    backgroundColor: OnboardingTheme.colors.primary,
    borderColor: OnboardingTheme.colors.primary,
  },
  calendarSide: {
    width: 50,
    gap: 8,
    justifyContent: "center",
  },
  sideCell: {
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: OnboardingTheme.colors.dark,
    backgroundColor: "transparent",
  },
  sideCellAccent: {
    backgroundColor: OnboardingTheme.colors.primary,
    borderColor: OnboardingTheme.colors.primary,
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
