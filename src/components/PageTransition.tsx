import { Colors } from "@/src/theme/colors";
import { useReducedMotion } from "motion/react";
import React, { CSSProperties } from "react";
import { Platform, StyleProp, View, ViewStyle } from "react-native";

interface Props {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * Smooth page transition wrapper.
 *
 * On web it runs a soft Framer Motion fade + rise as each screen enters.
 * On native the native stack already animates navigation, so this renders a
 * plain container (no double animation, no extra work).
 *
 * Respects `prefers-reduced-motion` by skipping the animation entirely.
 */
export function PageTransition({ children, style }: Props) {
  if (Platform.OS !== "web") {
    return (
      <View style={[{ flex: 1, backgroundColor: Colors.bg.default }, style]}>
        {children}
      </View>
    );
  }
  return <WebTransition style={style}>{children}</WebTransition>;
}

function WebTransition({ children, style }: Props) {
  const reduceMotion = useReducedMotion();
  // Lazy require keeps `motion/react` (a DOM library) out of native bundles
  // and out of the top-level module graph for native platforms.
  const { motion } = require("motion/react");
  const MotionDiv = motion.div;

  const cssStyle = style as unknown as CSSProperties;
  const base: CSSProperties = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: Colors.bg.default,
  };

  if (reduceMotion) {
    return (
      <div style={{ ...base, ...cssStyle }}>{children}</div>
    );
  }

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      style={{ ...base, minHeight: 0, ...cssStyle }}
    >
      {children}
    </MotionDiv>
  );
}
