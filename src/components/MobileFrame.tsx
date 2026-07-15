import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useFrame } from "./FrameContext";

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
    height: "100vh" as any,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  webInner: {
    flex: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
});
