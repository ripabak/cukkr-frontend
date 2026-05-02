import { useOnboardingStore } from "@/src/features/onboarding/stores/onboardingStore";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

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

    setHasHydrated(useOnboardingStore.persist.hasHydrated());

    return () => {
      unsubHydrate();
      unsubFinishHydration();
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    const href = hasSeenOnboarding ? "/home" : "/onboarding-splash";

    if (Platform.OS === "web") {
      window.location.replace(href);
      return;
    }

    router.replace(href);
  }, [hasHydrated, hasSeenOnboarding, router]);

  if (!hasHydrated) return null;

  return null;
}
