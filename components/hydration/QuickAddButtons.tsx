import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../lib/ThemeProvider';
import { radius, spacing, fontSize, accents } from '../../lib/theme';

const PRESETS = [
  { ml: 150, icon: 'cafe-outline' as const },
  { ml: 250, icon: 'water-outline' as const },
  { ml: 500, icon: 'beer-outline' as const },
];

type QuickAddButtonsProps = {
  onAdd: (ml: number) => void;
};

export function QuickAddButtons({ onAdd }: QuickAddButtonsProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {PRESETS.map((p) => (
        <Pressable
          key={p.ml}
          onPress={() => onAdd(p.ml)}
          style={[
            styles.button,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Ionicons name={p.icon} size={22} color={accents.hydration} />
          <Text style={[styles.label, { color: colors.text }]}>+{p.ml}ml</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
});
