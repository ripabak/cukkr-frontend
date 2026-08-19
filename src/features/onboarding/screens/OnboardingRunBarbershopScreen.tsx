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

export function OnboardingRunBarbershopScreen() {
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
                    style={[
                      styles.checkIcon,
                      checked && styles.checkIconActive,
                    ]}
                  />
                  <View style={styles.checkBar} />
                </View>
              ))}
            </View>
          </View>
        </OnboardingCard>

        <OnboardingIndicator current={1} total={3} />

        <View style={styles.textContent}>
          <AppText style={styles.heading}>
            {t("schedule.title")}
          </AppText>
          <AppText style={styles.body}>
            {t("onboarding.runBarbershopBody")}
          </AppText>
        </View>

        <View style={styles.spacer} />

        <OnboardingButton
          label={t("common.next")}
          onPress={() => router.push("/d/onboarding-customer-happy")}
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
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
    margin: theme.spacing.xs,
    padding: theme.spacing.md,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: theme.spacing.md,
  },
  bgBlock: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.lg,
  },
  figureArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: theme.spacing.xs,
  },
  figure: {
    width: 60,
    height: 120,
    backgroundColor: theme.colors.dark,
    borderRadius: theme.borderRadius.lg,
  },
  tablet: {
    width: 80,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: 6,
    gap: 4,
  },
  tabletRow: {
    height: 6,
    borderRadius: 3,
    backgroundColor: c.bg.surface,
  },
  tabletRowAccent: {
    backgroundColor: theme.colors.dark,
  },
  checkmarks: {
    gap: theme.spacing.sm,
    justifyContent: "center",
    marginBottom: theme.spacing.md,
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
    borderColor: theme.colors.dark,
    backgroundColor: "transparent",
  },
  checkIconActive: {
    backgroundColor: theme.colors.dark,
  },
  checkBar: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.dark,
    opacity: 0.7,
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