import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useTheme } from '../../lib/ThemeProvider';
import { fontSize, radius, spacing } from '../../lib/theme';

export type BarDatum = { label: string; value: number };

type SvgBarChartProps = {
  data: BarDatum[];
  color: string;
  height?: number;
  valueFormatter?: (v: number) => string;
};

export function SvgBarChart({
  data,
  color,
  height = 140,
  valueFormatter = (v) => `${v}`,
}: SvgBarChartProps) {
  const { colors } = useTheme();
  const max = Math.max(1, ...data.map((d) => d.value));
  const barWidth = 22;
  const gap = 14;
  const width = Math.max(1, data.length) * (barWidth + gap);
  const chartHeight = height - 28;

  return (
    <View>
      <Svg width={width} height={height}>
        {data.map((d, i) => {
          const barHeight = (d.value / max) * chartHeight;
          const x = i * (barWidth + gap) + gap / 2;
          return (
            <Rect
              key={i}
              x={x}
              y={chartHeight - barHeight}
              width={barWidth}
              height={Math.max(2, barHeight)}
              rx={6}
              fill={d.value > 0 ? color : colors.surfaceAlt}
            />
          );
        })}
      </Svg>
      <View style={styles.labelRow}>
        {data.map((d, i) => (
          <Text
            key={i}
            style={[styles.label, { color: colors.textMuted, width: barWidth + gap }]}
          >
            {d.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  label: {
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
});
