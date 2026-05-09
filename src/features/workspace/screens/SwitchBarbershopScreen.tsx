import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { SelectionRow } from "@/src/features/workspace/components/SelectionRow";
import { authClient } from "@/src/lib/auth-client";
import { useToast } from "@/src/lib/providers";
import { useRouter } from "expo-router";
import React, { useRef } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  runOnJS,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBarbershopList, useSetActiveOrganization } from "../hooks";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export function SwitchBarbershopScreen() {
  const router = useRouter();
  const toast = useToast();
  const { data: barbershops = [], isLoading } = useBarbershopList();
  const { mutate: setActive } = useSetActiveOrganization();
  const { data: activeOrg } = authClient.useActiveOrganization();
  const translateY = useSharedValue(0);
  const isAnimating = useRef(false);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const slideOutUp = (callback: () => void) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    translateY.value = withTiming(-SCREEN_HEIGHT, { duration: 350 }, () => {
      runOnJS(callback)();
    });
  };

  const navigateAfterSelect = () => {
    if (router.canGoBack()) {
      slideOutUp(() => router.back());
    } else {
      slideOutUp(() => router.replace("/"));
    }
  };

  const handleSelectBarbershop = (barbershopId: string) => {
    setActive(barbershopId, {
      onSuccess: navigateAfterSelect,
      onError: (error) => {
        toast.error("Failed to switch barbershop: " + error.message);
      },
    });
  };

  return (
    <Animated.View entering={SlideInUp.duration(400)} style={styles.animatedWrapper}>
      <Animated.View style={[styles.flex, animatedStyle]}>
        <SafeAreaView style={styles.safeArea}>
          <ScreenHeader onBack={() => slideOutUp(() => router.canGoBack() ? router.back() : router.replace("/"))} />
          <View style={styles.container}>
            <Text style={styles.title}>Switch Barbershop</Text>
            <Text style={styles.subtitle}>
              {"Choose barbershop you're working on"}
            </Text>

            {barbershops.map((shop, index) => (
              <SelectionRow
                key={shop.id}
                label={shop.name}
                onPress={() => handleSelectBarbershop(shop.id)}
                isLast={index === barbershops.length - 1}
                isActive={activeOrg?.id === shop.id}
              />
            ))}
            {!isLoading && barbershops.length === 0 ? (
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No barbershops found</Text>
              </View>
            ) : null}

            <View style={styles.flex} />
            <PrimaryButton
              label="Create New Barbershop"
              onPress={() => router.push("/create-barbershop-name-logo")}
            />
          </View>
        </SafeAreaView>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedWrapper: {
    flex: 1,
    backgroundColor: "#EEEEE0",
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
    marginBottom: 20,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  emptyText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  flex: {
    flex: 1,
  },
});
