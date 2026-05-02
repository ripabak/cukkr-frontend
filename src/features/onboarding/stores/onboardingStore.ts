import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type OnboardingState = {
  hasSeenOnboarding: boolean;
  hasHydrated: boolean;
  markOnboardingSeen: () => void;
  setHasHydrated: (value: boolean) => void;
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenOnboarding: false,
      hasHydrated: false,
      markOnboardingSeen: () => set({ hasSeenOnboarding: true }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "cukkr-onboarding",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ hasSeenOnboarding: state.hasSeenOnboarding }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
