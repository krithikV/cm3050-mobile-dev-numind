import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/ThemeProvider';
import { radius, spacing, fontSize } from '../../lib/theme';
import { contrastText } from '../../lib/color';

type Segment = { label: string; value: string };

type SegmentedControlProps = {
  segments: Segment[];
  value: string;
  onChange: (value: string) => void;
  accentColor?: string;
};

export function SegmentedControl({
  segments,
  value,
  onChange,
  accentColor,
}: SegmentedControlProps) {
  const { colors } = useTheme();
  const tint = accentColor ?? colors.tasks;

  return (
    <View style={[styles.container, { backgroundColor: colors.surfaceAlt }]}>
      {segments.map((seg) => {
        const active = seg.value === value;
        return (
          <Pressable
            key={seg.value}
            onPress={() => onChange(seg.value)}
            style={[
              styles.segment,
              active && { backgroundColor: tint },
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: active ? contrastText(tint) : colors.textMuted },
              ]}
            >
              {seg.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: radius.md,
    padding: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    alignItems: 'center',
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
