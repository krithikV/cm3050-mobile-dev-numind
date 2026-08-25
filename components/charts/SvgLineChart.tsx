import React from 'react';
import { View } from 'react-native';
import Svg, { Polyline, Circle, Line } from 'react-native-svg';
import { useTheme } from '../../lib/ThemeProvider';

type SvgLineChartProps = {
  values: (number | null)[]; // null = no data point for that slot
  min: number;
  max: number;
  color: string;
  width?: number;
  height?: number;
};

export function SvgLineChart({
  values,
  min,
  max,
  color,
  width = 300,
  height = 120,
}: SvgLineChartProps) {
  const { colors } = useTheme();
  const padding = 12;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  const step = values.length > 1 ? usableWidth / (values.length - 1) : 0;

  const points = values
    .map((v, i) => {
      if (v === null) return null;
      const x = padding + i * step;
      const ratio = (v - min) / (max - min || 1);
      const y = padding + usableHeight * (1 - ratio);
      return { x, y };
    });

  const polylinePoints = points
    .filter((p): p is { x: number; y: number } => p !== null)
    .map((p) => `${p.x},${p.y}`)
    .join(' ');

  return (
    <View>
      <Svg width={width} height={height}>
        <Line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke={colors.border}
          strokeWidth={1}
        />
        {polylinePoints.length > 0 && (
          <Polyline
            points={polylinePoints}
            fill="none"
            stroke={color}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {points.map((p, i) =>
          p ? <Circle key={i} cx={p.x} cy={p.y} r={4} fill={color} /> : null
        )}
      </Svg>
    </View>
  );
}
