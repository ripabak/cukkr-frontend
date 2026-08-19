import { useTheme, type ThemeColors } from "@/src/theme/ThemeContext";
import { useThemedStyles } from "@/src/theme/styles";
import React from "react";
import { StyleSheet, View } from "react-native";
import { AppText } from "@/src/components/AppText";

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
  barColor,
  chartHeight = 120,
  maxBars = 14,
}: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const filledColor = barColor ?? colors.brand.primary;
  const visible = data.length > maxBars ? data.slice(-maxBars) : data;
  const maxVal = Math.max(...visible.map((d) => d.value), 1);

  return (
    <View style={[styles.container, { height: chartHeight + 20 }]}>
      {visible.map((point, i) => {
        const barH = Math.max(
          (point.value / maxVal) * chartHeight,
          point.value > 0 ? 4 : 2,
        );
        return (
          <View key={i} style={styles.col}>
            <View
              style={[
                styles.bar,
                {
                  height: barH,
                  backgroundColor:
                    point.value > 0 ? filledColor : colors.border.default,
                  opacity: point.value > 0 ? 1 : 0.5,
                },
              ]}
            />
            <AppText style={styles.label} numberOfLines={1}>
              {point.label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const createStyles = (c: ThemeColors) =>
  StyleSheet.create({
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
      color: c.text.muted,
      marginTop: 5,
      textAlign: "center",
    },
  });
