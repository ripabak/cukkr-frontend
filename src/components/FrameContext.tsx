import React, { createContext, useContext } from "react";
import { Platform, useWindowDimensions } from "react-native";

const FRAME_DESKTOP = 390;
const DESKTOP_BREAKPOINT = 1024;

interface FrameContextValue {
  frameWidth: number;
}

const FrameContext = createContext<FrameContextValue>({ frameWidth: FRAME_DESKTOP });

export function useFrame() {
  return useContext(FrameContext);
}

export function FrameProvider({ children }: { children: React.ReactNode }) {
  const { width: viewportWidth } = useWindowDimensions();

  // mobile/tablet: full viewport width (no side gaps)
  // desktop (≥1024px): fixed 390px centered
  const frameWidth =
    Platform.OS !== "web"
      ? viewportWidth
      : viewportWidth >= DESKTOP_BREAKPOINT
      ? FRAME_DESKTOP
      : viewportWidth;

  return (
    <FrameContext.Provider value={{ frameWidth }}>
      {children}
    </FrameContext.Provider>
  );
}
