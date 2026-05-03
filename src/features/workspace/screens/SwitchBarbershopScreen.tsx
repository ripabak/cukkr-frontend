import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { SelectionRow } from "@/src/components/SelectionRow";
import { useToast } from "@/src/lib/providers";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBarbershopList, useSetActiveOrganization } from "../hooks";

export function SwitchBarbershopScreen() {
  const router = useRouter();
  const toast = useToast();
  const { data: barbershops = [], isLoading } = useBarbershopList();
  const { mutate: setActive } = useSetActiveOrganization();

  const handleSelectBarbershop = (barbershopId: string) => {
    setActive(barbershopId, {
      onSuccess: () => {
        router.back();
      },
      onError: (error) => {
        toast.error("Failed to switch barbershop: " + error.message);
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScreenHeader onBack={() => router.back()} />
        <Text style={styles.title}>Switch Barbershop</Text>
        <Text style={styles.subtitle}>
          {"Choose barbershop you're working on"}
        </Text>
        <View style={styles.spacer} />

        {isLoading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#C6FF4D" />
          </View>
        ) : barbershops.length > 0 ? (
          barbershops.map((shop, index) => (
            <SelectionRow
              key={shop.id}
              label={shop.name}
              onPress={() => handleSelectBarbershop(shop.id)}
              isLast={index === barbershops.length - 1}
            />
          ))
        ) : (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No barbershops found</Text>
          </View>
        )}

        <View style={styles.flex} />
        <PrimaryButton
          label="Create New Barbershop"
          onPress={() => router.push("/create-barbershop-name-logo")}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#EEEEE0",
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 24,
  },
  subtitle: {
    fontSize: 15,
    color: "#666666",
    marginTop: 8,
  },
  spacer: {
    marginTop: 32,
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
