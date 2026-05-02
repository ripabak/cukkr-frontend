import { useOnboardingStore } from "@/src/features/onboarding/stores/onboardingStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const router = useRouter();
  const hasSeenOnboarding = useOnboardingStore((s) => s.hasSeenOnboarding);
  const [hasHydrated, setHasHydrated] = useState(
    useOnboardingStore.persist.hasHydrated(),
  );

  useEffect(() => {
    const unsubHydrate = useOnboardingStore.persist.onHydrate(() => {
      setHasHydrated(false);
    });

    const unsubFinishHydration = useOnboardingStore.persist.onFinishHydration(
      () => {
        setHasHydrated(true);
      },
    );

    useOnboardingStore.persist.rehydrate();

    setHasHydrated(useOnboardingStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    const href = hasSeenOnboarding ? "/home" : "/onboarding-splash";
    console.log("Navigating to:", href, "hasHydrated:", hasHydrated);
    router.replace(href);
  }, [hasHydrated, hasSeenOnboarding, router]);

  if (!hasHydrated) return null;

  return null;
}
