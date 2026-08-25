import {
  useFitnessStore,
  stepsForDate,
  todaysSteps,
  stepsForLastNDays,
  weeklyStepTotal,
  monthlyStepTotal,
  todaysWorkouts,
  workoutTotalsForDate,
  workoutStreak,
  workoutFrequencyByCategory,
  achievementsFor,
  todaysMeals,
  mealsForDate,
  totalCalories,
  todaysCaloriesEaten,
  bodyMetricsSorted,
  latestBodyMetric,
  Workout,
} from '../store/useFitnessStore';
import { dateKey } from '../lib/date';

function resetStore() {
  useFitnessStore.setState({ steps: [], workouts: [], meals: [], routines: [], bodyMetrics: [] });
}

describe('useFitnessStore — steps', () => {
  beforeEach(resetStore);

  it('adds a manual step log for today by default', () => {
    useFitnessStore.getState().addSteps(1000);
    const steps = useFitnessStore.getState().steps;
    expect(steps).toHaveLength(1);
    expect(steps[0].amount).toBe(1000);
    expect(steps[0].date).toBe(dateKey());
    expect(steps[0].source).toBe('manual');
  });

  it('tags sensor-sourced steps', () => {
    useFitnessStore.getState().addSteps(250, 'sensor');
    expect(useFitnessStore.getState().steps[0].source).toBe('sensor');
  });

  it('sums steps for a given date regardless of source', () => {
    useFitnessStore.getState().addSteps(500);
    useFitnessStore.getState().addSteps(1500, 'sensor');
    expect(stepsForDate(useFitnessStore.getState().steps, dateKey())).toBe(2000);
    expect(todaysSteps(useFitnessStore.getState().steps)).toBe(2000);
  });

  it('returns n days of totals ending today', () => {
    useFitnessStore.getState().addSteps(3000);
    const last7 = stepsForLastNDays(useFitnessStore.getState().steps, 7);
    expect(last7).toHaveLength(7);
    expect(last7[6]).toBe(3000);
    expect(last7.slice(0, 6).every((v) => v === 0)).toBe(true);
  });

  it('sums the last 7 days for the weekly total', () => {
    useFitnessStore.getState().addSteps(1000);
    useFitnessStore.getState().addSteps(500);
    expect(weeklyStepTotal(useFitnessStore.getState().steps)).toBe(1500);
  });

  it('sums the current calendar month for the monthly total', () => {
    useFitnessStore.getState().addSteps(1000);
    useFitnessStore.setState({
      steps: [
        ...useFitnessStore.getState().steps,
        { id: 'old', date: '2020-01-01', amount: 9999, loggedAt: '', source: 'manual' },
      ],
    });
    expect(monthlyStepTotal(useFitnessStore.getState().steps)).toBe(1000);
  });
});

describe('useFitnessStore — workouts', () => {
  beforeEach(resetStore);

  it('adds and deletes a workout', () => {
    useFitnessStore.getState().addWorkout({
      name: 'Leg day',
      category: 'Strength',
      durationMinutes: 30,
      caloriesBurned: 200,
      date: dateKey(),
    });
    expect(useFitnessStore.getState().workouts).toHaveLength(1);
    const id = useFitnessStore.getState().workouts[0].id;
    useFitnessStore.getState().deleteWorkout(id);
    expect(useFitnessStore.getState().workouts).toHaveLength(0);
  });

  it('stores sets and distance when provided', () => {
    useFitnessStore.getState().addWorkout({
      name: 'Bench press',
      category: 'Strength',
      durationMinutes: 20,
      caloriesBurned: 100,
      date: dateKey(),
      sets: [{ reps: 10, weightKg: 40 }],
    });
    useFitnessStore.getState().addWorkout({
      name: '5k run',
      category: 'Cardio',
      durationMinutes: 25,
      caloriesBurned: 300,
      date: dateKey(),
      distanceKm: 5,
    });
    const [run, bench] = useFitnessStore.getState().workouts;
    expect(run.distanceKm).toBe(5);
    expect(bench.sets).toEqual([{ reps: 10, weightKg: 40 }]);
  });

  it("aggregates today's workout totals", () => {
    useFitnessStore.getState().addWorkout({
      name: 'Run',
      category: 'Cardio',
      durationMinutes: 20,
      caloriesBurned: 150,
      date: dateKey(),
    });
    useFitnessStore.getState().addWorkout({
      name: 'Yoga',
      category: 'Yoga',
      durationMinutes: 40,
      caloriesBurned: 100,
      date: dateKey(),
    });
    const workouts = useFitnessStore.getState().workouts;
    expect(todaysWorkouts(workouts)).toHaveLength(2);
    const totals = workoutTotalsForDate(workouts, dateKey());
    expect(totals.durationMinutes).toBe(60);
    expect(totals.caloriesBurned).toBe(250);
  });
});

describe('workoutStreak', () => {
  it('is 0 with no workouts', () => {
    expect(workoutStreak([])).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const workouts: Workout[] = [
      { id: '1', name: 'A', category: 'Cardio', durationMinutes: 10, caloriesBurned: 0, date: dateKey(today), createdAt: '' },
      { id: '2', name: 'B', category: 'Cardio', durationMinutes: 10, caloriesBurned: 0, date: dateKey(yesterday), createdAt: '' },
    ];
    expect(workoutStreak(workouts)).toBe(2);
  });
});

describe('workoutFrequencyByCategory', () => {
  it('counts workouts per category within the lookback window', () => {
    const workouts: Workout[] = [
      { id: '1', name: 'A', category: 'Cardio', durationMinutes: 10, caloriesBurned: 0, date: dateKey(), createdAt: '' },
      { id: '2', name: 'B', category: 'Cardio', durationMinutes: 10, caloriesBurned: 0, date: dateKey(), createdAt: '' },
      { id: '3', name: 'C', category: 'Strength', durationMinutes: 10, caloriesBurned: 0, date: dateKey(), createdAt: '' },
    ];
    expect(workoutFrequencyByCategory(workouts, 1)).toEqual([
      { category: 'Cardio', count: 2 },
      { category: 'Strength', count: 1 },
    ]);
  });
});

describe('achievementsFor', () => {
  it('unlocks the 10-workouts badge once reached', () => {
    const workouts: Workout[] = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      name: 'W',
      category: 'Cardio',
      durationMinutes: 10,
      caloriesBurned: 0,
      date: '2020-01-01',
      createdAt: '',
    }));
    const achievements = achievementsFor(workouts, workoutStreak(workouts));
    expect(achievements.find((a) => a.id === 'count-10')?.unlocked).toBe(true);
    expect(achievements.find((a) => a.id === 'count-50')?.unlocked).toBe(false);
  });

  it('unlocks the 5km badge based on max distance in a single session', () => {
    const workouts: Workout[] = [
      { id: '1', name: 'Run', category: 'Cardio', durationMinutes: 30, caloriesBurned: 0, date: '2020-01-01', createdAt: '', distanceKm: 6 },
    ];
    expect(achievementsFor(workouts, 0).find((a) => a.id === 'distance-5k')?.unlocked).toBe(
      true
    );
  });

  it('unlocks streak badges based on the passed-in streak, not recomputed', () => {
    const achievements = achievementsFor([], 7);
    expect(achievements.find((a) => a.id === 'streak-3')?.unlocked).toBe(true);
    expect(achievements.find((a) => a.id === 'streak-7')?.unlocked).toBe(true);
  });
});

describe('useFitnessStore — meals', () => {
  beforeEach(resetStore);

  it('adds and deletes a meal', () => {
    useFitnessStore.getState().addMeal({
      name: 'Oatmeal',
      mealType: 'breakfast',
      calories: 300,
      date: dateKey(),
    });
    expect(useFitnessStore.getState().meals).toHaveLength(1);
    const id = useFitnessStore.getState().meals[0].id;
    useFitnessStore.getState().deleteMeal(id);
    expect(useFitnessStore.getState().meals).toHaveLength(0);
  });

  it('sums calories eaten for today', () => {
    useFitnessStore.getState().addMeal({
      name: 'Oatmeal',
      mealType: 'breakfast',
      calories: 300,
      date: dateKey(),
    });
    useFitnessStore.getState().addMeal({
      name: 'Chicken salad',
      mealType: 'lunch',
      calories: 450,
      date: dateKey(),
    });
    const meals = useFitnessStore.getState().meals;
    expect(todaysMeals(meals)).toHaveLength(2);
    expect(totalCalories(mealsForDate(meals, dateKey()))).toBe(750);
    expect(todaysCaloriesEaten(meals)).toBe(750);
  });
});

describe('useFitnessStore — routines', () => {
  beforeEach(resetStore);

  it('adds and deletes a routine', () => {
    useFitnessStore.getState().addRoutine({
      name: 'Leg Day',
      exercises: [{ name: 'Squat', category: 'Strength', targetSets: 3, targetReps: 10 }],
    });
    expect(useFitnessStore.getState().routines).toHaveLength(1);
    const id = useFitnessStore.getState().routines[0].id;
    useFitnessStore.getState().deleteRoutine(id);
    expect(useFitnessStore.getState().routines).toHaveLength(0);
  });
});

describe('useFitnessStore — body metrics', () => {
  beforeEach(resetStore);

  it('adds and deletes a body metric', () => {
    useFitnessStore.getState().addBodyMetric(70.5);
    expect(useFitnessStore.getState().bodyMetrics).toHaveLength(1);
    const id = useFitnessStore.getState().bodyMetrics[0].id;
    useFitnessStore.getState().deleteBodyMetric(id);
    expect(useFitnessStore.getState().bodyMetrics).toHaveLength(0);
  });

  it('sorts metrics by date and finds the latest', () => {
    useFitnessStore.setState({
      bodyMetrics: [
        { id: '1', date: '2026-01-05', weightKg: 71, createdAt: '' },
        { id: '2', date: '2026-01-01', weightKg: 72, createdAt: '' },
      ],
    });
    const sorted = bodyMetricsSorted(useFitnessStore.getState().bodyMetrics);
    expect(sorted.map((m) => m.id)).toEqual(['2', '1']);
    expect(latestBodyMetric(useFitnessStore.getState().bodyMetrics)?.id).toBe('1');
  });
});
