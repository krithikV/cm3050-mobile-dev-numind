import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { dateKey } from '../lib/date';
import { newId } from '../lib/id';
import { storageKeys } from '../lib/storage';

export type StepLog = {
  id: string;
  date: string; // yyyy-MM-dd
  amount: number;
  loggedAt: string;
  source: 'manual' | 'sensor';
};

export type WorkoutSet = {
  reps: number;
  weightKg: number;
};

export type Workout = {
  id: string;
  name: string;
  category: string;
  durationMinutes: number;
  caloriesBurned: number;
  date: string; // yyyy-MM-dd
  createdAt: string;
  sets?: WorkoutSet[];
  distanceKm?: number;
};

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type Meal = {
  id: string;
  name: string;
  mealType: MealType;
  calories: number;
  date: string; // yyyy-MM-dd
  createdAt: string;
};

export type RoutineExercise = {
  name: string;
  category: string;
  targetSets?: number;
  targetReps?: number;
};

export type Routine = {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  createdAt: string;
};

export type BodyMetric = {
  id: string;
  date: string; // yyyy-MM-dd
  weightKg: number;
  createdAt: string;
};

type FitnessState = {
  steps: StepLog[];
  workouts: Workout[];
  meals: Meal[];
  routines: Routine[];
  bodyMetrics: BodyMetric[];

  addSteps: (amount: number, source?: StepLog['source']) => void;
  addWorkout: (input: Omit<Workout, 'id' | 'createdAt'>) => void;
  deleteWorkout: (id: string) => void;
  addMeal: (input: Omit<Meal, 'id' | 'createdAt'>) => void;
  deleteMeal: (id: string) => void;
  addRoutine: (input: { name: string; exercises: RoutineExercise[] }) => void;
  deleteRoutine: (id: string) => void;
  addBodyMetric: (weightKg: number) => void;
  deleteBodyMetric: (id: string) => void;
};

export const useFitnessStore = create<FitnessState>()(
  persist(
    (set, get) => ({
      steps: [],
      workouts: [],
      meals: [],
      routines: [],
      bodyMetrics: [],

      addSteps: (amount, source = 'manual') => {
        const log: StepLog = {
          id: newId(),
          date: dateKey(),
          amount,
          loggedAt: new Date().toISOString(),
          source,
        };
        set({ steps: [log, ...get().steps] });
      },

      addWorkout: (input) => {
        const workout: Workout = {
          ...input,
          id: newId(),
          createdAt: new Date().toISOString(),
        };
        set({ workouts: [workout, ...get().workouts] });
      },
      deleteWorkout: (id) =>
        set({ workouts: get().workouts.filter((w) => w.id !== id) }),

      addMeal: (input) => {
        const meal: Meal = {
          ...input,
          id: newId(),
          createdAt: new Date().toISOString(),
        };
        set({ meals: [meal, ...get().meals] });
      },
      deleteMeal: (id) => set({ meals: get().meals.filter((m) => m.id !== id) }),

      addRoutine: (input) => {
        const routine: Routine = {
          ...input,
          id: newId(),
          createdAt: new Date().toISOString(),
        };
        set({ routines: [routine, ...get().routines] });
      },
      deleteRoutine: (id) =>
        set({ routines: get().routines.filter((r) => r.id !== id) }),

      addBodyMetric: (weightKg) => {
        const metric: BodyMetric = {
          id: newId(),
          date: dateKey(),
          weightKg,
          createdAt: new Date().toISOString(),
        };
        set({ bodyMetrics: [metric, ...get().bodyMetrics] });
      },
      deleteBodyMetric: (id) =>
        set({ bodyMetrics: get().bodyMetrics.filter((m) => m.id !== id) }),
    }),
    {
      name: storageKeys.fitness,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function stepsForDate(steps: StepLog[], date: string): number {
  return steps.filter((s) => s.date === date).reduce((sum, s) => sum + s.amount, 0);
}

export function todaysSteps(steps: StepLog[]): number {
  return stepsForDate(steps, dateKey());
}

export function stepsForLastNDays(steps: StepLog[], n: number): number[] {
  const result: number[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - (n - 1));
  for (let i = 0; i < n; i++) {
    result.push(stepsForDate(steps, dateKey(cursor)));
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
}

export function weeklyStepTotal(steps: StepLog[]): number {
  return stepsForLastNDays(steps, 7).reduce((sum, v) => sum + v, 0);
}

export function monthlyStepTotal(steps: StepLog[]): number {
  const yyyyMM = dateKey().slice(0, 7);
  return steps.filter((s) => s.date.startsWith(yyyyMM)).reduce((sum, s) => sum + s.amount, 0);
}

export function workoutsForDate(workouts: Workout[], date: string): Workout[] {
  return workouts
    .filter((w) => w.date === date)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function todaysWorkouts(workouts: Workout[]): Workout[] {
  return workoutsForDate(workouts, dateKey());
}

export function workoutTotalsForDate(workouts: Workout[], date: string) {
  const dayWorkouts = workoutsForDate(workouts, date);
  return {
    durationMinutes: dayWorkouts.reduce((sum, w) => sum + w.durationMinutes, 0),
    caloriesBurned: dayWorkouts.reduce((sum, w) => sum + w.caloriesBurned, 0),
  };
}

export function workoutStreak(workouts: Workout[]): number {
  const dates = new Set(workouts.map((w) => w.date));
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = dateKey(cursor);
    if (!dates.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function workoutFrequencyByCategory(workouts: Workout[], monthsBack: number) {
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - monthsBack);
  const cutoffKey = dateKey(cutoff);
  const totals = new Map<string, number>();
  for (const w of workouts) {
    if (w.date < cutoffKey) continue;
    totals.set(w.category, (totals.get(w.category) ?? 0) + 1);
  }
  return Array.from(totals.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export type Achievement = { id: string; title: string; unlocked: boolean };

export function achievementsFor(workouts: Workout[], streak: number): Achievement[] {
  const totalWorkouts = workouts.length;
  const maxDistance = workouts.reduce((max, w) => Math.max(max, w.distanceKm ?? 0), 0);

  return [
    { id: 'streak-3', title: '3-day workout streak', unlocked: streak >= 3 },
    { id: 'streak-7', title: '7-day workout streak', unlocked: streak >= 7 },
    { id: 'count-10', title: '10 workouts logged', unlocked: totalWorkouts >= 10 },
    { id: 'count-50', title: '50 workouts logged', unlocked: totalWorkouts >= 50 },
    { id: 'distance-5k', title: '5km in one session', unlocked: maxDistance >= 5 },
  ];
}

export function mealsForDate(meals: Meal[], date: string): Meal[] {
  return meals
    .filter((m) => m.date === date)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function todaysMeals(meals: Meal[]): Meal[] {
  return mealsForDate(meals, dateKey());
}

// Takes a list already filtered to the day in question (e.g. via
// mealsForDate) — avoids re-filtering when the caller has already done so.
export function totalCalories(mealsForThatDay: Meal[]): number {
  return mealsForThatDay.reduce((sum, m) => sum + m.calories, 0);
}

export function todaysCaloriesEaten(meals: Meal[]): number {
  return totalCalories(todaysMeals(meals));
}

export function bodyMetricsSorted(metrics: BodyMetric[]): BodyMetric[] {
  return [...metrics].sort((a, b) => a.date.localeCompare(b.date));
}

export function latestBodyMetric(metrics: BodyMetric[]): BodyMetric | null {
  const sorted = bodyMetricsSorted(metrics);
  return sorted.length > 0 ? sorted[sorted.length - 1] : null;
}
