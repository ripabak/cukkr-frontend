import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { BrandSplash } from "../components/BrandSplash";

export function OnboardingSplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding-easy-booking");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return <BrandSplash />;
}
