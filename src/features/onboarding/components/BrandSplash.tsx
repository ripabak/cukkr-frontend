import { Colors } from "@/src/theme/colors";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, StyleSheet, View, ViewStyle } from "react-native";
import { AppText } from "@/src/components/AppText";

interface BrandSplashProps {
  style?: ViewStyle;
}

export const BrandSplash: React.FC<BrandSplashProps> = ({ style }) => {
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(barAnim, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(barAnim, {
          toValue: 0,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [barAnim]);

  const barTranslate = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 28.8],
  });

  return (
    <View style={[styles.container, style]}>
      <Image
        source={require("@/public/cukkr-logo-trans.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <AppText style={styles.title}>Cukkr</AppText>
      <View style={styles.bar}>
        <Animated.View
          style={[
            styles.barFill,
            { transform: [{ translateX: barTranslate }] },
          ]}
        />
      </View>
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
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text.primary,
    letterSpacing: -0.3,
    marginBottom: 36,
  },
  bar: {
    width: 48,
    height: 4,
    backgroundColor: Colors.border.light,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: {
    width: "40%",
    height: "100%",
    backgroundColor: Colors.brand.primary,
    borderRadius: 4,
  },
});
