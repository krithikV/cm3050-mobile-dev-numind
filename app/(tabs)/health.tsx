import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { addDays, format } from 'date-fns';
import { Screen } from '../../components/ui/Screen';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { FAB } from '../../components/ui/FAB';
import { IconButton } from '../../components/ui/IconButton';
import { DateNavigator } from '../../components/ui/DateNavigator';
import { WaterSection } from '../../components/hydration/WaterSection';
import { StepsSection } from '../../components/fitness/StepsSection';
import { WorkoutsSection } from '../../components/fitness/WorkoutsSection';
import { WorkoutForm } from '../../components/fitness/WorkoutForm';
import { RoutineForm } from '../../components/fitness/RoutineForm';
import { FoodSection } from '../../components/fitness/FoodSection';
import { MealForm } from '../../components/fitness/MealForm';
import { BodySection } from '../../components/fitness/BodySection';
import { BodyMetricForm } from '../../components/fitness/BodyMetricForm';
import { AlarmManager } from '../../components/fitness/AlarmManager';
import { useHydrationStore, totalForDate, logsForDate } from '../../store/useHydrationStore';
import {
  useFitnessStore,
  stepsForDate,
  stepsForLastNDays,
  monthlyStepTotal,
  workoutsForDate,
  workoutTotalsForDate,
  mealsForDate,
  totalCalories,
  Routine,
} from '../../store/useFitnessStore';
import { useAlarmsStore } from '../../store/useAlarmsStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { dateKey } from '../../lib/date';
import { accents, spacing } from '../../lib/theme';

type Section = 'water' | 'steps' | 'workouts' | 'food' | 'body';
type WorkoutView = 'log' | 'routines';

export default function HealthScreen() {
  const [section, setSection] = useState<Section>('water');
  const [workoutView, setWorkoutView] = useState<WorkoutView>('log');
  const [workoutFormVisible, setWorkoutFormVisible] = useState(false);
  const [routineFormVisible, setRoutineFormVisible] = useState(false);
  const [mealFormVisible, setMealFormVisible] = useState(false);
  const [bodyFormVisible, setBodyFormVisible] = useState(false);
  const [alarmManagerVisible, setAlarmManagerVisible] = useState(false);
  const [dayOffset, setDayOffset] = useState(0);

  const [startingRoutine, setStartingRoutine] = useState<Routine | null>(null);
  const [startingIndex, setStartingIndex] = useState(0);

  const hydrationLogs = useHydrationStore((s) => s.logs);
  const addWaterLog = useHydrationStore((s) => s.addLog);
  const removeWaterLog = useHydrationStore((s) => s.removeLog);
  const hydrationGoalMl = useSettingsStore((s) => s.hydrationGoalMl);

  const steps = useFitnessStore((s) => s.steps);
  const addSteps = useFitnessStore((s) => s.addSteps);
  const workouts = useFitnessStore((s) => s.workouts);
  const addWorkout = useFitnessStore((s) => s.addWorkout);
  const deleteWorkout = useFitnessStore((s) => s.deleteWorkout);
  const routines = useFitnessStore((s) => s.routines);
  const addRoutine = useFitnessStore((s) => s.addRoutine);
  const deleteRoutine = useFitnessStore((s) => s.deleteRoutine);
  const meals = useFitnessStore((s) => s.meals);
  const addMeal = useFitnessStore((s) => s.addMeal);
  const deleteMeal = useFitnessStore((s) => s.deleteMeal);
  const bodyMetrics = useFitnessStore((s) => s.bodyMetrics);
  const addBodyMetric = useFitnessStore((s) => s.addBodyMetric);
  const deleteBodyMetric = useFitnessStore((s) => s.deleteBodyMetric);
  const stepGoal = useSettingsStore((s) => s.stepGoal);
  const dailyCalorieGoal = useSettingsStore((s) => s.dailyCalorieGoal);

  const alarms = useAlarmsStore((s) => s.alarms);
  const addAlarm = useAlarmsStore((s) => s.addAlarm);
  const toggleAlarm = useAlarmsStore((s) => s.toggleAlarm);
  const deleteAlarm = useAlarmsStore((s) => s.deleteAlarm);

  const isToday = dayOffset === 0;
  const selectedDate = addDays(new Date(), dayOffset);
  const selectedDateKey = dateKey(selectedDate);

  // Each of these is only relevant while its section is actually visible —
  // gate the computation on `section` so switching tabs doesn't rescan every
  // store's full history on every render.
  const waterData = useMemo(
    () =>
      section === 'water'
        ? {
            currentMl: totalForDate(hydrationLogs, selectedDateKey),
            todaysLogs: logsForDate(hydrationLogs, selectedDateKey),
          }
        : null,
    [section, hydrationLogs, selectedDateKey]
  );

  const stepsData = useMemo(
    () =>
      section === 'steps'
        ? {
            todaySteps: stepsForDate(steps, selectedDateKey),
            last7Days: stepsForLastNDays(steps, 7),
            monthlyTotal: monthlyStepTotal(steps),
          }
        : null,
    [section, steps, selectedDateKey]
  );

  const workoutsData = useMemo(() => {
    if (section !== 'workouts') return null;
    const totals = workoutTotalsForDate(workouts, selectedDateKey);
    return {
      todaysWorkouts: workoutsForDate(workouts, selectedDateKey),
      totalDuration: totals.durationMinutes,
      totalCalories: totals.caloriesBurned,
    };
  }, [section, workouts, selectedDateKey]);

  const foodData = useMemo(() => {
    if (section !== 'food') return null;
    const dayMeals = mealsForDate(meals, selectedDateKey);
    return { meals: dayMeals, caloriesEaten: totalCalories(dayMeals) };
  }, [section, meals, selectedDateKey]);

  const accentFor: Record<Section, string> = {
    water: accents.hydration,
    steps: accents.steps,
    workouts: accents.fitness,
    food: accents.food,
    body: accents.hydration,
  };

  const handleStartRoutine = (routine: Routine) => {
    setStartingRoutine(routine);
    setStartingIndex(0);
  };

  const currentRoutineExercise =
    startingRoutine && startingIndex < startingRoutine.exercises.length
      ? startingRoutine.exercises[startingIndex]
      : null;

  const handleWorkoutFormSubmit = (input: Parameters<typeof addWorkout>[0]) => {
    addWorkout(input);
    if (startingRoutine) {
      const nextIndex = startingIndex + 1;
      if (nextIndex < startingRoutine.exercises.length) {
        setStartingIndex(nextIndex);
      } else {
        setStartingRoutine(null);
        setStartingIndex(0);
      }
    }
  };

  return (
    <Screen
      title="Health"
      subtitle="Water, steps, workouts & food"
      headerRight={
        <IconButton icon="alarm-outline" onPress={() => setAlarmManagerVisible(true)} />
      }
      floatingAction={
        <>
          {section === 'workouts' && workoutView === 'log' && isToday && (
            <FAB color={accents.fitness} onPress={() => setWorkoutFormVisible(true)} />
          )}
          {section === 'workouts' && workoutView === 'routines' && (
            <FAB color={accents.fitness} onPress={() => setRoutineFormVisible(true)} />
          )}
          {section === 'food' && isToday && (
            <FAB color={accents.food} onPress={() => setMealFormVisible(true)} />
          )}
          {section === 'body' && (
            <FAB color={accents.hydration} onPress={() => setBodyFormVisible(true)} />
          )}
        </>
      }
    >
      {section !== 'body' && (
        <DateNavigator
          label={isToday ? 'Today' : format(selectedDate, 'EEE, MMM d')}
          onPrev={() => setDayOffset((o) => o - 1)}
          onNext={() => setDayOffset((o) => Math.min(0, o + 1))}
          nextDisabled={isToday}
        />
      )}

      <SegmentedControl
        segments={[
          { label: 'Water', value: 'water' },
          { label: 'Steps', value: 'steps' },
          { label: 'Workouts', value: 'workouts' },
          { label: 'Food', value: 'food' },
          { label: 'Body', value: 'body' },
        ]}
        value={section}
        onChange={(v) => setSection(v as Section)}
        accentColor={accentFor[section]}
      />
      <View style={{ height: spacing.md }} />

      {section === 'water' && waterData && (
        <WaterSection
          currentMl={waterData.currentMl}
          goalMl={hydrationGoalMl}
          todaysLogs={waterData.todaysLogs}
          onAdd={addWaterLog}
          onRemove={removeWaterLog}
          showQuickAdd={isToday}
        />
      )}

      {section === 'steps' && stepsData && (
        <StepsSection
          todaySteps={stepsData.todaySteps}
          goal={stepGoal}
          last7Days={stepsData.last7Days}
          monthlyTotal={stepsData.monthlyTotal}
          onAdd={addSteps}
          onSensorSteps={(amount) => addSteps(amount, 'sensor')}
          isToday={isToday}
        />
      )}

      {section === 'workouts' && workoutsData && (
        <WorkoutsSection
          workoutView={workoutView}
          onChangeWorkoutView={setWorkoutView}
          todaysWorkouts={workoutsData.todaysWorkouts}
          allWorkouts={workouts}
          totalDuration={workoutsData.totalDuration}
          totalCalories={workoutsData.totalCalories}
          onDeleteWorkout={deleteWorkout}
          routines={routines}
          onStartRoutine={handleStartRoutine}
          onDeleteRoutine={deleteRoutine}
          isToday={isToday}
        />
      )}

      {section === 'food' && foodData && (
        <FoodSection
          meals={foodData.meals}
          caloriesEaten={foodData.caloriesEaten}
          calorieGoal={dailyCalorieGoal}
          onDelete={deleteMeal}
        />
      )}

      {section === 'body' && (
        <BodySection metrics={bodyMetrics} onDelete={deleteBodyMetric} />
      )}

      <WorkoutForm
        key={startingRoutine ? `${startingRoutine.id}-${startingIndex}` : 'manual'}
        visible={workoutFormVisible || startingRoutine !== null}
        onClose={() => {
          setWorkoutFormVisible(false);
          setStartingRoutine(null);
          setStartingIndex(0);
        }}
        onSubmit={handleWorkoutFormSubmit}
        initial={currentRoutineExercise}
      />
      <RoutineForm
        visible={routineFormVisible}
        onClose={() => setRoutineFormVisible(false)}
        onSubmit={addRoutine}
      />
      <MealForm
        visible={mealFormVisible}
        onClose={() => setMealFormVisible(false)}
        onSubmit={addMeal}
      />
      <BodyMetricForm
        visible={bodyFormVisible}
        onClose={() => setBodyFormVisible(false)}
        onSubmit={addBodyMetric}
      />
      <AlarmManager
        visible={alarmManagerVisible}
        onClose={() => setAlarmManagerVisible(false)}
        alarms={alarms}
        onAdd={addAlarm}
        onToggle={toggleAlarm}
        onDelete={deleteAlarm}
      />
    </Screen>
  );
}
