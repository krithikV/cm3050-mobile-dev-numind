import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WorkoutItem } from './WorkoutItem';
import { RoutineItem } from './RoutineItem';
import { EmptyState } from '../ui/EmptyState';
import { Card } from '../ui/Card';
import { GlowIconBadge } from '../ui/GlowIconBadge';
import { SegmentedControl } from '../ui/SegmentedControl';
import {
  Workout,
  Routine,
  workoutStreak,
  achievementsFor,
} from '../../store/useFitnessStore';
import { useTheme } from '../../lib/ThemeProvider';
import { accents, spacing, fontSize } from '../../lib/theme';

type WorkoutView = 'log' | 'routines';

type WorkoutsSectionProps = {
  workoutView: WorkoutView;
  onChangeWorkoutView: (v: WorkoutView) => void;
  todaysWorkouts: Workout[];
  allWorkouts: Workout[];
  totalDuration: number;
  totalCalories: number;
  onDeleteWorkout: (id: string) => void;
  routines: Routine[];
  onStartRoutine: (routine: Routine) => void;
  onDeleteRoutine: (id: string) => void;
  isToday: boolean;
};

export function WorkoutsSection({
  workoutView,
  onChangeWorkoutView,
  todaysWorkouts,
  allWorkouts,
  totalDuration,
  totalCalories,
  onDeleteWorkout,
  routines,
  onStartRoutine,
  onDeleteRoutine,
  isToday,
}: WorkoutsSectionProps) {
  const { colors } = useTheme();

  // Only worth computing while the Log view (the one that displays them) is
  // actually showing.
  const streak = useMemo(
    () => (workoutView === 'log' ? workoutStreak(allWorkouts) : 0),
    [workoutView, allWorkouts]
  );
  const achievements = useMemo(
    () =>
      workoutView === 'log'
        ? achievementsFor(allWorkouts, streak).filter((a) => a.unlocked)
        : [],
    [workoutView, allWorkouts, streak]
  );

  return (
    <View>
      <SegmentedControl
        segments={[
          { label: 'Log', value: 'log' },
          { label: 'Routines', value: 'routines' },
        ]}
        value={workoutView}
        onChange={(v) => onChangeWorkoutView(v as WorkoutView)}
        accentColor={accents.fitness}
      />
      <View style={{ height: spacing.md }} />

      {workoutView === 'log' ? (
        <>
          <Card style={{ marginBottom: spacing.md }}>
            <View style={styles.statsRow}>
              <Stat label="Workouts" value={`${todaysWorkouts.length}`} />
              <Stat label="Minutes" value={`${totalDuration}`} />
              <Stat label="Calories" value={`${totalCalories}`} />
            </View>
          </Card>

          <View style={styles.streakRow}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={[styles.streakText, { color: colors.text }]}>
              {streak} day{streak === 1 ? '' : 's'} workout streak
            </Text>
          </View>

          {achievements.length > 0 && (
            <View style={{ marginBottom: spacing.md }}>
              <Text style={[styles.sectionLabel, { color: colors.text }]}>Achievements</Text>
              {achievements.map((a) => (
                <View key={a.id} style={styles.achievementRow}>
                  <GlowIconBadge icon="trophy" color={accents.fitness} size={32} />
                  <Text style={[styles.achievementTitle, { color: colors.text }]}>
                    {a.title}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {todaysWorkouts.length === 0 ? (
            <EmptyState
              icon="barbell-outline"
              title="No workouts logged"
              subtitle={
                isToday ? 'Tap the + button to log a workout.' : 'Nothing logged this day.'
              }
              accentColor={accents.fitness}
            />
          ) : (
            <View>
              {todaysWorkouts.map((w) => (
                <WorkoutItem key={w.id} workout={w} onDelete={() => onDeleteWorkout(w.id)} />
              ))}
            </View>
          )}
        </>
      ) : routines.length === 0 ? (
        <EmptyState
          icon="list-outline"
          title="No routines yet"
          subtitle="Tap the + button to build one."
          accentColor={accents.fitness}
        />
      ) : (
        <View>
          {!isToday && (
            <Text style={[styles.routineNotice, { color: colors.textMuted }]}>
              Switch to Today to start a routine.
            </Text>
          )}
          {routines.map((r) => (
            <RoutineItem
              key={r.id}
              routine={r}
              onStart={() => onStartRoutine(r)}
              onDelete={() => onDeleteRoutine(r.id)}
              startDisabled={!isToday}
            />
          ))}
        </View>
      )}
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statsRow: {
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
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  streakEmoji: {
    fontSize: fontSize.lg,
    marginRight: spacing.xs,
  },
  streakText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  achievementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  achievementTitle: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  routineNotice: {
    fontSize: fontSize.sm,
    marginBottom: spacing.sm,
  },
});
