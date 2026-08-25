import { StyleSheet } from 'react-native';
import { spacing, fontSize } from '../../lib/theme';

// Shared across every Sheet-based form (TransactionForm, GoalForm, MealForm,
// WorkoutForm, RoutineForm, TaskForm, BodyMetricForm, AddFundsForm) so a
// tweak to form typography/spacing only needs to happen once.
export const formStyles = StyleSheet.create({
  heading: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
});
