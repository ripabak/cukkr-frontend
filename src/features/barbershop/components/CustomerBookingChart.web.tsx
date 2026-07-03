import React from "react";
import { View, ActivityIndicator } from "react-native";
import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";
import { Colors } from "@/src/theme/colors";

interface Props {
  title: string;
  subtitle?: string;
  subtitleColor?: string;
  data: { label: string; value: number; [key: string]: string | number }[];
  style?: import("react-native").ViewStyle;
}

export function CustomerBookingChart(props: Props) {
  return (
    <WithSkiaWeb
      getComponent={() => import("./CustomerBookingChartBase")}
      opts={{ locateFile: () => "/canvaskit.wasm" }}
      fallback={
        <View style={{ height: 140, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator color={Colors.brand.primary} />
        </View>
      }
      componentProps={props}
    />
  );
}
