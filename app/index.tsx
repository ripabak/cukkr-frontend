import { useOnboardingStore } from "@/src/features/onboarding/stores/onboardingStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  const hasSeenOnboarding = useOnboardingStore((s) => s.hasSeenOnboarding);
  const hasHydrated = useOnboardingStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    router.replace(hasSeenOnboarding ? "/(tabs)/home" : "/onboarding-splash");
  }, [hasHydrated, hasSeenOnboarding]);

  return null;
}
