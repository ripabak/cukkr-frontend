import { Colors } from "@/src/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ChartPoint {
  label: string;
  value: number;
}

interface Props {
  data: ChartPoint[];
  barColor?: string;
  chartHeight?: number;
  valueFormatter?: (v: number) => string;
  maxBars?: number;
}

export function BarChart({
  data,
  barColor = Colors.brand.primary,
  chartHeight = 120,
  maxBars = 14,
}: Props) {
  const visible = data.length > maxBars ? data.slice(-maxBars) : data;
  const maxVal = Math.max(...visible.map((d) => d.value), 1);

  return (
    <View style={[styles.container, { height: chartHeight + 20 }]}>
      {visible.map((point, i) => {
        const barH = Math.max((point.value / maxVal) * chartHeight, point.value > 0 ? 4 : 2);
        return (
          <View key={i} style={styles.col}>
            <View
              style={[
                styles.bar,
                {
                  height: barH,
                  backgroundColor: point.value > 0 ? barColor : Colors.border.default,
                  opacity: point.value > 0 ? 1 : 0.5,
                },
              ]}
            />
            <Text style={styles.label} numberOfLines={1}>
              {point.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
  },
  col: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    width: "80%",
    borderRadius: 4,
    minWidth: 4,
  },
  label: {
    fontSize: 9,
    color: Colors.text.muted,
    marginTop: 5,
    textAlign: "center",
  },
});
