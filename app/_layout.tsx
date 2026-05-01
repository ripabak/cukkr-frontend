import { DevNavFloat } from "@/src/components/DevNavFloat";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <DevNavFloat />
    </View>
  );
}
