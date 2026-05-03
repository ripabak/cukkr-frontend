import { PrimaryButton } from "@/src/components/PrimaryButton";
import { ScreenHeader } from "@/src/components/ScreenHeader";
import { SelectionRow } from "@/src/components/SelectionRow";
import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { barbershopService } from "../services";

interface Barbershop {
  id: string;
  name: string;
  slug: string;
  role: string;
}

export function SwitchBarbershopScreen() {
  const router = useRouter();
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBarbershops();
  }, []);

  const loadBarbershops = async () => {
    setIsLoading(true);
    try {
      const data = await barbershopService.getList();
      setBarbershops(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading barbershops:", error);
      Alert.alert("Error", "Failed to load barbershops");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectBarbershop = async (barbershopId: string) => {
    const { data, error } = await authClient.organization.setActive({
      organizationId: barbershopId
    })
    console.log("Switched Barberbshop")
    console.log(data)
    router.back();
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
