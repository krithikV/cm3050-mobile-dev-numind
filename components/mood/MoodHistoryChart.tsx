import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { format } from 'date-fns';
import { SvgLineChart } from '../charts/SvgLineChart';
import { useTheme } from '../../lib/ThemeProvider';
import { accents, fontSize, spacing } from '../../lib/theme';
import { MoodEntry, lastNDaysEntries } from '../../store/useMoodStore';

type MoodHistoryChartProps = {
  entries: MoodEntry[];
  days?: number;
};

export function MoodHistoryChart({ entries, days = 7 }: MoodHistoryChartProps) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const chartWidth = Math.min(340, width - spacing.md * 2 - spacing.md * 2);

  const slots = lastNDaysEntries(entries, days);
  const values = slots.map((e) => (e ? e.score : null));

  const dayLabels = (() => {
    const cursor = new Date();
    cursor.setDate(cursor.getDate() - (days - 1));
    const labels: string[] = [];
    for (let i = 0; i < days; i++) {
      labels.push(format(cursor, days > 7 ? 'd' : 'EEEEE'));
      cursor.setDate(cursor.getDate() + 1);
    }
    return labels;
  })();

  return (
    <View>
      <SvgLineChart
        values={values}
        min={1}
        max={5}
        color={accents.mood}
        width={chartWidth}
        height={120}
      />
      {days <= 7 && (
        <View style={[styles.labelRow, { width: chartWidth }]}>
          {dayLabels.map((l, i) => (
            <Text key={i} style={[styles.label, { color: colors.textMuted }]}>
              {l}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  label: {
    fontSize: fontSize.xs,
  },
});
