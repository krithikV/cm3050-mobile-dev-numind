import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { Screen } from '../components/ui/Screen';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { SegmentedControl } from '../components/ui/SegmentedControl';
import { Chip } from '../components/ui/Chip';
import { Button } from '../components/ui/Button';
import { IconButton } from '../components/ui/IconButton';
import { useSettingsStore, ThemePreference } from '../store/useSettingsStore';
import { useTaskStore } from '../store/useTaskStore';
import { useMoodStore } from '../store/useMoodStore';
import { useHydrationStore } from '../store/useHydrationStore';
import { useFitnessStore } from '../store/useFitnessStore';
import { useAlarmsStore } from '../store/useAlarmsStore';
import { useBudgetStore, DEFAULT_CATEGORIES } from '../store/useBudgetStore';
import { useTheme } from '../lib/ThemeProvider';
import { spacing, fontSize, accents } from '../lib/theme';

const GOAL_OPTIONS = [1500, 2000, 2500, 3000];
const INTERVAL_OPTIONS = [30, 60, 90, 120];
const STEP_GOAL_OPTIONS = [5000, 8000, 10000, 12000];
const CALORIE_GOAL_OPTIONS = [1500, 2000, 2500, 3000];

export default function SettingsScreen() {
  const { colors } = useTheme();
  const displayName = useSettingsStore((s) => s.displayName);
  const setDisplayName = useSettingsStore((s) => s.setDisplayName);
  const themePreference = useSettingsStore((s) => s.themePreference);
  const setThemePreference = useSettingsStore((s) => s.setThemePreference);
  const hydrationGoalMl = useSettingsStore((s) => s.hydrationGoalMl);
  const setHydrationGoalMl = useSettingsStore((s) => s.setHydrationGoalMl);
  const hydrationReminderMinutes = useSettingsStore((s) => s.hydrationReminderMinutes);
  const setHydrationReminderMinutes = useSettingsStore(
    (s) => s.setHydrationReminderMinutes
  );
  const hydrationRemindersEnabled = useSettingsStore((s) => s.hydrationRemindersEnabled);
  const setHydrationRemindersEnabled = useSettingsStore(
    (s) => s.setHydrationRemindersEnabled
  );
  const stepGoal = useSettingsStore((s) => s.stepGoal);
  const setStepGoal = useSettingsStore((s) => s.setStepGoal);
  const dailyCalorieGoal = useSettingsStore((s) => s.dailyCalorieGoal);
  const setDailyCalorieGoal = useSettingsStore((s) => s.setDailyCalorieGoal);

  const clearTasks = useTaskStore.persist.clearStorage;
  const clearMood = useMoodStore.persist.clearStorage;
  const clearHydration = useHydrationStore.persist.clearStorage;
  const clearFitness = useFitnessStore.persist.clearStorage;
  const clearBudget = useBudgetStore.persist.clearStorage;
  const clearAlarms = useAlarmsStore.persist.clearStorage;

  const handleClearData = () => {
    Alert.alert(
      'Clear all data',
      'This will permanently delete all tasks, mood entries, health logs (steps, workouts, routines, meals, body metrics), alarms, and budget data (transactions, budgets, categories, goals), and reset budget categories to defaults. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear everything',
          style: 'destructive',
          onPress: () => {
            clearTasks();
            clearMood();
            clearHydration();
            clearFitness();
            clearBudget();
            clearAlarms();
            useTaskStore.setState({ tasks: [] });
            useMoodStore.setState({ entries: [] });
            useHydrationStore.setState({ logs: [] });
            useFitnessStore.setState({
              steps: [],
              workouts: [],
              meals: [],
              routines: [],
              bodyMetrics: [],
            });
            useAlarmsStore.setState({ alarms: [] });
            useBudgetStore.setState({
              transactions: [],
              categories: DEFAULT_CATEGORIES,
              categoryBudgets: [],
              overallBudget: null,
              savingsGoals: [],
            });
          },
        },
      ]
    );
  };

  return (
    <Screen
      title="Settings"
      headerRight={<IconButton icon="close" onPress={() => router.back()} />}
    >
      <SettingsSection title="Profile">
        <Card>
          <Input
            label="Your name"
            placeholder="e.g. Krithik"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
          />
        </Card>
      </SettingsSection>

      <SettingsSection title="Appearance">
        <Card>
          <SegmentedControl
            segments={[
              { label: 'System', value: 'system' },
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
            ]}
            value={themePreference}
            onChange={(v) => setThemePreference(v as ThemePreference)}
          />
        </Card>
      </SettingsSection>

      <SettingsSection title="Hydration">
        <Card>
          <Text style={[styles.label, { color: colors.textMuted }]}>Daily goal</Text>
          <View style={styles.chipRow}>
            {GOAL_OPTIONS.map((g) => (
              <Chip
                key={g}
                label={`${g / 1000}L`}
                selected={hydrationGoalMl === g}
                accentColor={accents.hydration}
                onPress={() => setHydrationGoalMl(g)}
              />
            ))}
          </View>

          <Text style={[styles.label, { color: colors.textMuted, marginTop: spacing.md }]}>
            Reminder interval
          </Text>
          <View style={styles.chipRow}>
            {INTERVAL_OPTIONS.map((m) => (
              <Chip
                key={m}
                label={m < 60 ? `${m}m` : `${m / 60}h`}
                selected={hydrationReminderMinutes === m}
                accentColor={accents.hydration}
                onPress={() => setHydrationReminderMinutes(m)}
              />
            ))}
          </View>

          <View style={{ height: spacing.md }} />
          <Button
            label={hydrationRemindersEnabled ? 'Disable reminders' : 'Enable reminders'}
            accentColor={accents.hydration}
            variant={hydrationRemindersEnabled ? 'secondary' : 'primary'}
            onPress={() => setHydrationRemindersEnabled(!hydrationRemindersEnabled)}
            fullWidth
          />
          <Text style={[styles.notice, { color: colors.textMuted, marginTop: spacing.sm }]}>
            Reminders show as an in-app alert while NuMind is open.
          </Text>
        </Card>
      </SettingsSection>

      <SettingsSection title="Fitness">
        <Card>
          <Text style={[styles.label, { color: colors.textMuted }]}>Daily step goal</Text>
          <View style={styles.chipRow}>
            {STEP_GOAL_OPTIONS.map((g) => (
              <Chip
                key={g}
                label={g.toLocaleString()}
                selected={stepGoal === g}
                accentColor={accents.steps}
                onPress={() => setStepGoal(g)}
              />
            ))}
          </View>

          <Text style={[styles.label, { color: colors.textMuted, marginTop: spacing.md }]}>
            Daily calorie goal
          </Text>
          <View style={styles.chipRow}>
            {CALORIE_GOAL_OPTIONS.map((g) => (
              <Chip
                key={g}
                label={`${g}`}
                selected={dailyCalorieGoal === g}
                accentColor={accents.food}
                onPress={() => setDailyCalorieGoal(g)}
              />
            ))}
          </View>
        </Card>
      </SettingsSection>

      <SettingsSection title="Data">
        <Card>
          <Button
            label="Clear all data"
            variant="danger"
            onPress={handleClearData}
            fullWidth
          />
        </Card>
      </SettingsSection>
    </Screen>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View style={{ marginBottom: spacing.lg }}>
      <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  notice: {
    fontSize: fontSize.sm,
    lineHeight: 20,
  },
});
