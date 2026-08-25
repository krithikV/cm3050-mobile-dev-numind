import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../../lib/ThemeProvider';
import { fontSize } from '../../lib/theme';

type ProgressRingProps = {
  progress: number; // 0..1
  size?: number;
  strokeWidth?: number;
  color: string;
  label?: string;
  sublabel?: string;
};

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 12,
  color,
  label,
  sublabel,
}: ProgressRingProps) {
  const { colors } = useTheme();
  const clamped = Math.min(1, Math.max(0, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - clamped);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.surfaceAlt}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          fill="none"
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.centerContent}>
          {label && (
            <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
          )}
          {sublabel && (
            <Text style={[styles.sublabel, { color: colors.textMuted }]}>
              {sublabel}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  sublabel: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
});
