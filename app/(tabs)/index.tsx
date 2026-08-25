import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { IconButton } from '../../components/ui/IconButton';
import { GlowIconBadge } from '../../components/ui/GlowIconBadge';
import { ProgressRow } from '../../components/ui/ProgressRow';
import { useTaskStore, tasksDueToday } from '../../store/useTaskStore';
import { useMoodStore, getMoodStreak } from '../../store/useMoodStore';
import { useHydrationStore, todaysTotal } from '../../store/useHydrationStore';
import { useFitnessStore, todaysSteps, todaysWorkouts } from '../../store/useFitnessStore';
import { useBudgetStore, monthSummary } from '../../store/useBudgetStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { dateKey } from '../../lib/date';
import { formatCurrency } from '../../lib/format';
import { useTheme } from '../../lib/ThemeProvider';
import { accents, spacing, fontSize } from '../../lib/theme';

const MOOD_EMOJI: Record<number, string> = {
  1: '😞',
  2: '😕',
  3: '😐',
  4: '🙂',
  5: '😄',
};

function greeting(name: string) {
  const hour = new Date().getHours();
  const base = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const trimmedName = name.trim();
  return trimmedName ? `${base}, ${trimmedName.split(' ')[0]}` : base;
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const displayName = useSettingsStore((s) => s.displayName);
  const tasks = useTaskStore((s) => s.tasks);
  const moodEntries = useMoodStore((s) => s.entries);
  const hydrationLogs = useHydrationStore((s) => s.logs);
  const hydrationGoal = useSettingsStore((s) => s.hydrationGoalMl);
  const steps = useFitnessStore((s) => s.steps);
  const workouts = useFitnessStore((s) => s.workouts);
  const transactions = useBudgetStore((s) => s.transactions);

  const { dueToday, activeTasks, completedTasks } = useMemo(() => {
    const active = tasks.filter((t) => !t.completed).length;
    return {
      dueToday: tasksDueToday(tasks).length,
      activeTasks: active,
      completedTasks: tasks.length - active,
    };
  }, [tasks]);
  const todayMood = useMemo(
    () => moodEntries.find((e) => e.date === dateKey()),
    [moodEntries]
  );
  const moodStreak = useMemo(() => getMoodStreak(moodEntries), [moodEntries]);
  const waterMl = useMemo(() => todaysTotal(hydrationLogs), [hydrationLogs]);
  const stepsToday = useMemo(() => todaysSteps(steps), [steps]);
  const workoutsToday = useMemo(() => todaysWorkouts(workouts).length, [workouts]);
  const budget = useMemo(
    () => monthSummary(transactions, format(new Date(), 'yyyy-MM')),
    [transactions]
  );

  return (
    <Screen
      title={greeting(displayName)}
      subtitle={format(new Date(), 'EEEE, MMMM d')}
      headerRight={
        <IconButton icon="settings-outline" onPress={() => router.push('/settings')} />
      }
    >
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's plan</Text>

      <ProgressRow
        icon="checkmark-circle"
        color={accents.tasks}
        title="Tasks"
        subtitle={`${activeTasks} left${dueToday ? ` · ${dueToday} due today` : ''}`}
        progress={tasks.length > 0 ? completedTasks / tasks.length : undefined}
        onPress={() => router.push('/tasks')}
      />

      <ProgressRow
        icon="happy"
        color={accents.mood}
        title="Mood"
        subtitle={
          todayMood
            ? `Feeling ${MOOD_EMOJI[todayMood.score]} today`
            : 'Tap to check in'
        }
        onPress={() => router.push('/mood')}
      />

      <ProgressRow
        icon="heart"
        color={accents.hydration}
        title="Health"
        subtitle={`${(waterMl / 1000).toFixed(1)}L water · ${stepsToday.toLocaleString()} steps`}
        progress={hydrationGoal > 0 ? waterMl / hydrationGoal : undefined}
        onPress={() => router.push('/health')}
      />

      <ProgressRow
        icon="wallet"
        color={accents.budget}
        title="Budget"
        subtitle={`${formatCurrency(budget.remaining)} remaining this month`}
        progress={budget.income > 0 ? budget.remaining / budget.income : undefined}
        onPress={() => router.push('/budget')}
      />

      <View style={{ height: spacing.lg }} />
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Highlights</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.highlightRow}
      >
        <HighlightCard
          icon="flame"
          color={accents.mood}
          value={`${moodStreak}`}
          label={`day${moodStreak === 1 ? '' : 's'} mood streak`}
        />
        <HighlightCard
          icon="footsteps"
          color={accents.steps}
          value={stepsToday.toLocaleString()}
          label="steps today"
        />
        <HighlightCard
          icon="checkmark-done"
          color={accents.tasks}
          value={`${completedTasks}`}
          label="tasks completed"
        />
        <HighlightCard
          icon="barbell"
          color={accents.fitness}
          value={`${workoutsToday}`}
          label="workouts today"
        />
      </ScrollView>
    </Screen>
  );
}

function HighlightCard({
  icon,
  color,
  value,
  label,
}: {
  icon: string;
  color: string;
  value: string;
  label: string;
}) {
  const { colors } = useTheme();
  return (
    <Card style={styles.highlightCard}>
      <GlowIconBadge icon={icon} color={color} size={40} />
      <Text style={[styles.highlightValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.highlightLabel, { color: colors.textMuted }]} numberOfLines={2}>
        {label}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  highlightRow: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  highlightCard: {
    width: 128,
    alignItems: 'flex-start',
  },
  highlightValue: {
    fontSize: fontSize.lg,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  highlightLabel: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
});
