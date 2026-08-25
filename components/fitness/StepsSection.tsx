import React from 'react';
import { View, Text, Pressable, Platform, StyleSheet } from 'react-native';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressRing } from '../ui/ProgressRing';
import { SvgBarChart } from '../charts/SvgBarChart';
import { useTheme } from '../../lib/ThemeProvider';
import { accents, spacing, fontSize, radius } from '../../lib/theme';
import { useStepTracking } from '../../lib/pedometer';

const PRESETS = [500, 1000, 2000];

type StepsSectionProps = {
  todaySteps: number;
  goal: number;
  last7Days: number[];
  monthlyTotal: number;
  onAdd: (amount: number) => void;
  onSensorSteps: (amount: number) => void;
  isToday: boolean;
};

export function StepsSection({
  todaySteps,
  goal,
  last7Days,
  monthlyTotal,
  onAdd,
  onSensorSteps,
  isToday,
}: StepsSectionProps) {
  const { colors } = useTheme();
  const remaining = Math.max(0, goal - todaySteps);

  const { available, tracking, starting, start, stop, setKnownTotal } = useStepTracking(
    isToday,
    onSensorSteps
  );
  setKnownTotal(todaySteps);

  const chartData = last7Days.map((value, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { label: format(d, 'EEEEE'), value };
  });

  return (
    <View>
      <Card style={styles.ringCard}>
        <ProgressRing
          progress={goal > 0 ? todaySteps / goal : 0}
          size={160}
          strokeWidth={14}
          color={accents.steps}
          label={todaySteps.toLocaleString()}
          sublabel={remaining > 0 ? `${remaining.toLocaleString()} to go` : 'Goal reached!'}
        />

        <View style={{ height: spacing.md }} />

        {!isToday ? (
          <Text style={[styles.unavailableText, { color: colors.textMuted }]}>
            Viewing history — switch to Today to track or log steps.
          </Text>
        ) : available === false ? (
          <Text style={[styles.unavailableText, { color: colors.textMuted }]}>
            No step sensor found on this device — use the buttons below to log manually.
          </Text>
        ) : (
          <>
            <Button
              label={tracking ? 'Stop tracking' : 'Start tracking'}
              icon={tracking ? 'stop-circle-outline' : 'play-circle-outline'}
              accentColor={accents.steps}
              variant={tracking ? 'secondary' : 'primary'}
              loading={starting}
              disabled={available === null}
              onPress={tracking ? stop : start}
            />
            {tracking && (
              <View style={styles.sensorBadge}>
                <Ionicons name="pulse-outline" size={14} color={accents.steps} />
                <Text style={[styles.sensorLabel, { color: accents.steps }]}>
                  {Platform.OS === 'ios' ? 'Syncing from Health' : 'Tracking live'}
                </Text>
              </View>
            )}
          </>
        )}
      </Card>

      {isToday && (
        <>
          <View style={{ height: spacing.md }} />
          <View style={styles.row}>
            {PRESETS.map((p) => (
              <Pressable
                key={p}
                onPress={() => onAdd(p)}
                style={[styles.button, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <Ionicons name="footsteps-outline" size={20} color={accents.steps} />
                <Text style={[styles.buttonLabel, { color: colors.text }]}>+{p}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      <View style={{ height: spacing.lg }} />
      <Card style={{ marginBottom: spacing.md }}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Last 7 days</Text>
        <SvgBarChart data={chartData} color={accents.steps} />
      </Card>

      <Card>
        <View style={styles.monthlyRow}>
          <Text style={[styles.cardTitle, { color: colors.text, marginBottom: 0 }]}>
            This month
          </Text>
          <Text style={[styles.monthlyValue, { color: accents.steps }]}>
            {monthlyTotal.toLocaleString()} steps
          </Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  ringCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  unavailableText: {
    fontSize: fontSize.sm,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  sensorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  sensorLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginLeft: 4,
  },
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
  buttonLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  monthlyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  monthlyValue: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
});
