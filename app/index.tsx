import { useOnboardingStore } from "@/src/features/onboarding/stores/onboardingStore";
import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();
  const hasSeenOnboarding = useOnboardingStore((s) => s.hasSeenOnboarding);
  const hasHydrated = useOnboardingStore((s) => s.hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;
    if (pathname !== "/") return;
    router.replace(
      hasSeenOnboarding ? "/d/(tabs)/home" : "/d/onboarding-splash",
    );
  }, [hasHydrated, hasSeenOnboarding, pathname]);

  return null;
}
