import { Colors } from "@/src/theme/colors";
import React, { useCallback, useState } from "react";
import { View, StyleSheet, ViewStyle, LayoutChangeEvent } from "react-native";
import { AppText } from "@/src/components/AppText";
import { CartesianChart, Line, Scatter } from "victory-native";

type ChartPoint = {
  label: string;
  value: number;
  [key: string]: string | number;
};

interface Props {
  title: string;
  subtitle?: string;
  subtitleColor?: string;
  data: ChartPoint[];
  style?: ViewStyle;
}

export default function CustomerBookingChart({
  title,
  subtitle,
  subtitleColor = Colors.brand.primary,
  data,
  style,
}: Props) {
  const [chartWidth, setChartWidth] = useState(0);
  const hasData = data.length > 0 && data.some((d) => d.value > 0);

  const maxVal = hasData
    ? Math.max(...data.map((d) => d.value as number), 1)
    : 1;

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    setChartWidth(e.nativeEvent.layout.width);
  }, []);

  return (
    <View style={[styles.card, style]}>
      <AppText style={styles.title}>{title}</AppText>
      {subtitle ? (
        <AppText style={[styles.subtitle, { color: subtitleColor }]}>
          {subtitle}
        </AppText>
      ) : null}

      <View style={styles.chartContainer} onLayout={handleLayout}>
        {hasData && chartWidth > 0 ? (
          <View>
            <CartesianChart
              data={data}
              xKey="label"
              yKeys={["value"]}
              domain={{ y: [0, Math.ceil(maxVal * 1.2) || 1] }}
              domainPadding={{ top: 4, bottom: 12, left: 8, right: 8 }}
              axisOptions={{
                lineWidth: { grid: { x: 0, y: 0 }, frame: 0 },
              }}
            >
              {({ points }) => (
                <>
                  <Line
                    points={points.value}
                    color={Colors.brand.primary}
                    strokeWidth={2.5}
                    curveType="monotoneX"
                  />
                  <Scatter
                    points={points.value}
                    color={Colors.brand.primaryDark}
                    radius={4}
                    style="fill"
                  />
                </>
              )}
            </CartesianChart>
            <View style={styles.xLabels}>
              {data.map((d, i) => (
                <AppText key={i} style={styles.xLabel}>
                  {d.label as string}
                </AppText>
              ))}
            </View>
          </View>
        ) : hasData ? (
          <View style={styles.chartPlaceholder} />
        ) : (
          <AppText style={styles.emptyText}>No booking data yet</AppText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bg.default,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border.default,
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 8,
  },
  chartContainer: {
    height: 200,
    flex: 1,
  },
  chartPlaceholder: {
    height: 200,
    flex: 1,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.text.muted,
    textAlign: "center",
    paddingVertical: 90,
  },
  xLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  xLabel: {
    fontSize: 10,
    color: Colors.icon.muted,
    textAlign: "center",
  },
});
