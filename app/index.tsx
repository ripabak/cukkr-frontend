import { useOnboardingStore } from "@/src/features/onboarding/stores/onboardingStore";
import { Redirect } from "expo-router";

export default function Index() {
  const hasSeenOnboarding = useOnboardingStore((s) => s.hasSeenOnboarding);
  return (
    <Redirect
      href={hasSeenOnboarding ? "/home-dashboard" : "/onboarding-splash"}
    />
  );
}
