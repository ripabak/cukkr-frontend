import { DevNavFloat } from "@/src/components/DevNavFloat";
import { MobileFrame } from "@/src/components/MobileFrame";
import { ToastProvider, ToastContainer } from "@/src/lib/providers";
import { Stack } from "expo-router";
import { View } from "react-native";

export default function RootLayout() {
  return (
    <ToastProvider>
      <MobileFrame>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
          <DevNavFloat />
        </View>
        <ToastContainer />
      </MobileFrame>
    </ToastProvider>
  );
}
