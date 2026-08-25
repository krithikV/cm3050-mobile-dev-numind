import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { CategoryBreakdown } from './CategoryBreakdown';
import { BudgetBar } from './BudgetBar';
import { TrendChart } from './TrendChart';
import { useTheme } from '../../lib/ThemeProvider';
import { accents, spacing, fontSize } from '../../lib/theme';
import { formatCurrency } from '../../lib/format';

type OverviewSectionProps = {
  income: number;
  expenses: number;
  remaining: number;
  overallBudget: { limit: number; spent: number; remaining: number } | null;
  breakdown: { category: string; amount: number }[];
  trend: { yyyyMM: string; income: number; expenses: number }[];
};

export function OverviewSection({
  income,
  expenses,
  remaining,
  overallBudget,
  breakdown,
  trend,
}: OverviewSectionProps) {
  const { colors } = useTheme();

  return (
    <View>
      <Card style={{ marginBottom: spacing.md }}>
        <View style={styles.summaryRow}>
          <SummaryStat label="Income" value={income} color={accents.tasks} />
          <SummaryStat label="Expenses" value={expenses} color={accents.coral} />
          <SummaryStat label="Remaining" value={remaining} color={accents.budget} />
        </View>
      </Card>

      {overallBudget && (
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Overall budget</Text>
          <BudgetBar
            label="This month"
            spent={overallBudget.spent}
            limit={overallBudget.limit}
          />
        </Card>
      )}

      {breakdown.length > 0 && (
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            Spending by category
          </Text>
          <CategoryBreakdown data={breakdown} />
        </Card>
      )}

      <Card>
        <Text style={[styles.cardTitle, { color: colors.text }]}>
          Expenses — last 6 months
        </Text>
        <TrendChart data={trend} />
      </Card>
    </View>
  );
}

function SummaryStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{formatCurrency(value)}</Text>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
});
