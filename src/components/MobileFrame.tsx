import React from "react";
import { Platform, StyleSheet, View } from "react-native";

const MOBILE_WIDTH = 390;

interface Props {
  children: React.ReactNode;
}

export function MobileFrame({ children }: Props) {
  if (Platform.OS !== "web") {
    return <View style={styles.native}>{children}</View>;
  }

  return (
    <View style={styles.webOuter}>
      <View style={styles.webInner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  native: {
    flex: 1,
  },
  webOuter: {
    flex: 1,
    minHeight: "100vh" as any,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
  },
  webInner: {
    width: MOBILE_WIDTH,
    flex: 1,
    overflow: "hidden",
  },
});
