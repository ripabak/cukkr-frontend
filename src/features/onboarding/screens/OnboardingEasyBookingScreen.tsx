import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";
import { useI18nContext } from "@/src/lib/i18n/provider";
import { OnboardingButton } from "../components/OnboardingButton";
import { OnboardingCard } from "../components/OnboardingCard";
import { OnboardingContainer } from "../components/OnboardingContainer";
import { OnboardingIndicator } from "../components/OnboardingIndicator";
import { buildOnboardingTheme } from "../onboarding-theme";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export function OnboardingEasyBookingScreen() {
  const router = useRouter();
  const { t } = useI18nContext();
  const { colors } = useTheme();
  const theme = buildOnboardingTheme(colors);
  const styles = useThemedStyles(createStyles);

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
          <AppText style={styles.heading}>{t("home.newBooking")}</AppText>
          <AppText style={styles.body}>
            {t("onboarding.easyBookingBody")}
          </AppText>
        </View>

        <View style={styles.spacer} />

        <OnboardingButton
          label={t("common.next")}
          onPress={() => router.push("/d/onboarding-run-barbershop")}
          style={styles.button}
        />
      </View>
    </OnboardingContainer>
  );
}

const createStyles = (c: ThemeColors) => {
  const theme = buildOnboardingTheme(c);
  return StyleSheet.create({
  container: {
    backgroundColor: c.bg.default,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  content: {
    flex: 1,
    width: "100%",
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
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
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
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
    borderColor: theme.colors.dark,
    backgroundColor: "transparent",
  },
  calendarCellAccent: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
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
    borderColor: theme.colors.dark,
    backgroundColor: "transparent",
  },
  sideCellAccent: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  textContent: {
    marginTop: theme.spacing.xl,
    alignItems: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "600",
    color: theme.colors.textDark,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  body: {
    fontSize: 14,
    color: theme.colors.textGray,
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
};