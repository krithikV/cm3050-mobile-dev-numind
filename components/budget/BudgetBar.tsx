import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/ThemeProvider';
import { accents, spacing, fontSize, radius } from '../../lib/theme';
import { formatCurrency } from '../../lib/format';

type BudgetBarProps = {
  label: string;
  spent: number;
  limit: number;
};

export function BudgetBar({ label, spent, limit }: BudgetBarProps) {
  const { colors } = useTheme();
  const progress = limit > 0 ? spent / limit : 0;
  const over = spent > limit;
  const barColor = over ? colors.danger : accents.budget;

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <Text style={[styles.amounts, { color: over ? colors.danger : colors.textMuted }]}>
          {formatCurrency(spent)} / {formatCurrency(limit)}
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: colors.surfaceAlt }]}>
        <View
          style={[
            styles.fill,
            { width: `${Math.min(1, progress) * 100}%`, backgroundColor: barColor },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  amounts: {
    fontSize: fontSize.xs,
    fontWeight: '600',
  },
  track: {
    height: 8,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
});
