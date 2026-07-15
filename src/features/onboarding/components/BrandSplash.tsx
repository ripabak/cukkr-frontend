import { Colors } from "@/src/theme/colors";
import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface BrandSplashProps {
  style?: ViewStyle;
}

export const BrandSplash: React.FC<BrandSplashProps> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.logoMark}>
        <View style={styles.logoAccent} />
      </View>
      <AppText style={styles.wordmark}>cukkr</AppText>
    </View>
  );
};

export default BrandSplash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg.default,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.brand.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoAccent: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.brand.primaryDark,
    transform: [{ rotate: "15deg" }],
  },
  wordmark: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.text.primary,
    letterSpacing: 1,
  },
});
