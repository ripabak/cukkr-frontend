import React from 'react';
import { View, Text, ViewStyle } from 'react-native';

interface ChartPoint {
  x: number;
  y: number;
}

interface Props {
  title: string;
  subtitle?: string;
  subtitleColor?: string;
  xLabels?: string[];
  yLabels?: string[];
  style?: ViewStyle;
  className?: string;
}

const MOCK_POINTS: ChartPoint[] = [
  { x: 0, y: 0.68 }, { x: 0.04, y: 0.72 }, { x: 0.08, y: 0.65 },
  { x: 0.13, y: 0.70 }, { x: 0.17, y: 0.66 }, { x: 0.21, y: 0.62 },
  { x: 0.25, y: 0.58 }, { x: 0.29, y: 0.60 }, { x: 0.33, y: 0.55 },
  { x: 0.38, y: 0.52 }, { x: 0.42, y: 0.50 }, { x: 0.46, y: 0.48 },
  { x: 0.50, y: 0.52 }, { x: 0.54, y: 0.46 }, { x: 0.58, y: 0.44 },
  { x: 0.63, y: 0.40 }, { x: 0.67, y: 0.43 }, { x: 0.71, y: 0.38 },
  { x: 0.75, y: 0.35 }, { x: 0.79, y: 0.32 }, { x: 0.83, y: 0.30 },
  { x: 0.88, y: 0.28 }, { x: 0.92, y: 0.25 }, { x: 0.96, y: 0.22 },
  { x: 1.0, y: 0.18 },
];

export function ChartCard({ title, subtitle, subtitleColor = '#B8E031', xLabels = ['Jan', 'Jun', 'Dec'], yLabels = ['100K', '50K', '00'], style, className }: Props) {
  const CHART_HEIGHT = 100;

  return (
    <View className={`bg-card rounded-xl p-lg gap-[4px] ${className ?? ''}`} style={style}>
      <Text className="text-[15px] font-bold text-dark">{title}</Text>
      {subtitle && <Text className="text-[12px] font-medium mb-sm" style={{ color: subtitleColor }}>{subtitle}</Text>}

      <View className="flex-row mt-[4px]" style={{ height: 120 }}>
        <View style={{ width: 36, justifyContent: 'space-between', alignItems: 'flex-end', paddingRight: 6, paddingBottom: 18 }}>
          {yLabels.map((label) => (
            <Text key={label} className="text-[10px] text-[#AAAAAA]">{label}</Text>
          ))}
        </View>

        <View className="flex-1 relative">
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#E8E8E0' }} />
          <View style={{ position: 'absolute', top: '50%' as unknown as number, left: 0, right: 0, height: 1, borderStyle: 'dashed', borderWidth: 1, borderColor: '#E8E8E0' }} />

          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 100, overflow: 'hidden' }}>
            {MOCK_POINTS.map((pt, i) => {
              if (i === MOCK_POINTS.length - 1) return null;
              const next = MOCK_POINTS[i + 1];
              const x1 = pt.x * 100;
              const y1 = (1 - pt.y) * CHART_HEIGHT;
              const x2 = next.x * 100;
              const y2 = (1 - next.y) * CHART_HEIGHT;
              const dx = x2 - x1;
              const dy = y2 - y1;
              const len = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);

              return (
                <View
                  key={i}
                  style={{
                    position: 'absolute',
                    left: `${x1}%` as unknown as number,
                    top: y1,
                    width: len * 1.5,
                    height: 2,
                    backgroundColor: '#B8E031',
                    transformOrigin: '0 50%',
                    transform: [{ rotate: `${angle}deg` }],
                  }}
                />
              );
            })}
          </View>

          <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between' }}>
            {xLabels.map((label) => (
              <Text key={label} className="text-[10px] text-[#AAAAAA]">{label}</Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}


