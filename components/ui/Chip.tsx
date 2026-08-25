import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/ThemeProvider';
import { radius, spacing, fontSize } from '../../lib/theme';
import { contrastText } from '../../lib/color';

type ChipProps = {
  label: string;
  selected?: boolean;
  accentColor?: string;
  onPress?: () => void;
};

export function Chip({ label, selected, accentColor, onPress }: ChipProps) {
  const { colors } = useTheme();
  const tint = accentColor ?? colors.tasks;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: selected ? tint : colors.surfaceAlt,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: selected ? contrastText(tint) : colors.text },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
});
