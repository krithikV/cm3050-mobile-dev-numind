import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MealItem } from './MealItem';
import { EmptyState } from '../ui/EmptyState';
import { Card } from '../ui/Card';
import { ProgressRing } from '../ui/ProgressRing';
import { Meal } from '../../store/useFitnessStore';
import { useTheme } from '../../lib/ThemeProvider';
import { accents, spacing, fontSize } from '../../lib/theme';

type FoodSectionProps = {
  meals: Meal[];
  caloriesEaten: number;
  calorieGoal: number;
  onDelete: (id: string) => void;
};

export function FoodSection({
  meals,
  caloriesEaten,
  calorieGoal,
  onDelete,
}: FoodSectionProps) {
  const { colors } = useTheme();

  return (
    <View>
      <Card style={styles.ringCard}>
        <ProgressRing
          progress={calorieGoal > 0 ? caloriesEaten / calorieGoal : 0}
          size={140}
          strokeWidth={12}
          color={accents.food}
          label={`${caloriesEaten}`}
          sublabel={`of ${calorieGoal} kcal`}
        />
      </Card>

      <View style={{ height: spacing.lg }} />
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's meals</Text>
      {meals.length === 0 ? (
        <EmptyState
          icon="restaurant-outline"
          title="No food logged today"
          subtitle="Tap the + button to log a meal."
          accentColor={accents.food}
        />
      ) : (
        <View>
          {meals.map((m) => (
            <MealItem key={m.id} meal={m} onDelete={() => onDelete(m.id)} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ringCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
});
