import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/ThemeProvider';
import { radius, spacing, fontSize, accents } from '../../lib/theme';
import { formatCurrency } from '../../lib/format';

type CategoryBreakdownProps = {
  data: { category: string; amount: number }[];
};

export function CategoryBreakdown({ data }: CategoryBreakdownProps) {
  const { colors } = useTheme();
  const max = Math.max(1, ...data.map((d) => d.amount));

  if (data.length === 0) return null;

  return (
    <View>
      {data.map((d) => (
        <View key={d.category} style={styles.row}>
          <Text style={[styles.label, { color: colors.text }]} numberOfLines={1}>
            {d.category}
          </Text>
          <View style={[styles.track, { backgroundColor: colors.surfaceAlt }]}>
            <View
              style={[
                styles.fill,
                {
                  width: `${(d.amount / max) * 100}%`,
                  backgroundColor: accents.budget,
                },
              ]}
            />
          </View>
          <Text style={[styles.amount, { color: colors.textMuted }]}>
            {formatCurrency(d.amount)}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    width: 76,
    fontSize: fontSize.sm,
    fontWeight: '600',
  },
  track: {
    flex: 1,
    height: 10,
    borderRadius: radius.full,
    marginHorizontal: spacing.sm,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
  amount: {
    width: 64,
    fontSize: fontSize.xs,
    textAlign: 'right',
  },
});
