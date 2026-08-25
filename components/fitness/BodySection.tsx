import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { SvgLineChart } from '../charts/SvgLineChart';
import { BodyMetric, bodyMetricsSorted, latestBodyMetric } from '../../store/useFitnessStore';
import { useTheme } from '../../lib/ThemeProvider';
import { accents, spacing, fontSize, radius } from '../../lib/theme';

type BodySectionProps = {
  metrics: BodyMetric[];
  onDelete: (id: string) => void;
};

export function BodySection({ metrics, onDelete }: BodySectionProps) {
  const { colors } = useTheme();
  const sorted = bodyMetricsSorted(metrics);
  const latest = latestBodyMetric(metrics);
  const recent = sorted.slice(-14);

  if (metrics.length === 0) {
    return (
      <EmptyState
        icon="body-outline"
        title="No weight logged yet"
        subtitle="Tap the + button to log your first entry."
        accentColor={accents.hydration}
      />
    );
  }

  return (
    <View>
      <Card style={styles.summaryCard}>
        <Text style={[styles.latestValue, { color: colors.text }]}>
          {latest?.weightKg.toFixed(1)} kg
        </Text>
        <Text style={[styles.latestLabel, { color: colors.textMuted }]}>
          Latest — {latest ? format(parseISO(latest.date), 'MMM d, yyyy') : ''}
        </Text>
      </Card>

      <View style={{ height: spacing.md }} />
      {recent.length >= 2 && (
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Trend</Text>
          <SvgLineChart
            values={recent.map((m) => m.weightKg)}
            min={Math.min(...recent.map((m) => m.weightKg)) - 1}
            max={Math.max(...recent.map((m) => m.weightKg)) + 1}
            color={accents.hydration}
            width={300}
            height={120}
          />
        </Card>
      )}

      <Text style={[styles.cardTitle, { color: colors.text }]}>History</Text>
      {[...sorted].reverse().map((m) => (
        <View
          key={m.id}
          style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Text style={[styles.rowValue, { color: colors.text }]}>{m.weightKg.toFixed(1)} kg</Text>
          <Text style={[styles.rowDate, { color: colors.textMuted }]}>
            {format(parseISO(m.date), 'MMM d, yyyy')}
          </Text>
          <Pressable onPress={() => onDelete(m.id)} hitSlop={8}>
            <Ionicons name="close" size={16} color={colors.textMuted} />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  latestValue: {
    fontSize: fontSize.xxl,
    fontWeight: '800',
  },
  latestLabel: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.sm,
  },
  rowValue: {
    fontSize: fontSize.md,
    fontWeight: '600',
    flex: 1,
  },
  rowDate: {
    fontSize: fontSize.sm,
    marginRight: spacing.sm,
  },
});
