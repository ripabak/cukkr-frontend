import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useFrame } from "./FrameContext";
import { Colors } from "@/src/theme/colors";

interface Props {
  children: React.ReactNode;
}

export function MobileFrame({ children }: Props) {
  const { frameWidth } = useFrame();

  if (Platform.OS !== "web") {
    return <View style={styles.native}>{children}</View>;
  }

  return (
    <View style={styles.webOuter}>
      <View style={[styles.webInner, { width: frameWidth }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  native: {
    flex: 1,
  },
  webOuter: {
    flex: 1,
    height: "100dvh" as any,
    backgroundColor: Colors.bg.chrome,
    alignItems: "center",
  },
  webInner: {
    flex: 1,
    overflow: "hidden",
    boxShadow: "0px 0px 32px rgba(23, 28, 35, 0.12)",
  },
});
