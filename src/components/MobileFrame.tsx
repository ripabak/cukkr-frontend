import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useFrame } from "./FrameContext";
import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";

interface Props {
  children: React.ReactNode;
}

export function MobileFrame({ children }: Props) {
  const { frameWidth } = useFrame();
  const styles = useThemedStyles(createStyles);

  if (Platform.OS !== "web") {
    return <View style={styles.native}>{children}</View>;
  }

  return (
    <View style={styles.webOuter}>
      <View style={[styles.webInner, { width: frameWidth }]}>{children}</View>
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
    native: {
      flex: 1,
    },
    webOuter: {
      flex: 1,
      height: "100dvh" as any,
      backgroundColor: c.bg.chrome,
      alignItems: "center",
    },
    webInner: {
      flex: 1,
      overflow: "hidden",
      boxShadow: "0px 0px 32px rgba(23, 28, 35, 0.12)",
    },
  });
