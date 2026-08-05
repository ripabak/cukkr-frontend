import { Colors } from "@/src/theme/colors";
import React from "react";
import { Image, StyleSheet, View } from "react-native";

export function AppHeader() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/public/cukkr-logo-trans.png")}
        style={styles.logo}
        resizeMode="contain"
        tintColor={Colors.brand.primaryDark}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  logo: {
    width: 36,
    height: 36,
  },
});
