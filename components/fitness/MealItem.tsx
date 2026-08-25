import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { GlowIconBadge } from '../ui/GlowIconBadge';
import { useTheme } from '../../lib/ThemeProvider';
import { radius, spacing, fontSize, accents } from '../../lib/theme';
import { Meal } from '../../store/useFitnessStore';

const MEAL_ICON: Record<Meal['mealType'], keyof typeof Ionicons.glyphMap> = {
  breakfast: 'sunny-outline',
  lunch: 'restaurant-outline',
  dinner: 'moon-outline',
  snack: 'cafe-outline',
};

const MEAL_LABEL: Record<Meal['mealType'], string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

type MealItemProps = {
  meal: Meal;
  onDelete: () => void;
};

export function MealItem({ meal, onDelete }: MealItemProps) {
  const { colors } = useTheme();

  return (
    <Swipeable
      renderRightActions={() => (
        <Pressable
          onPress={onDelete}
          style={[styles.deleteAction, { backgroundColor: colors.danger }]}
        >
          <Ionicons name="trash-outline" size={22} color="#fff" />
        </Pressable>
      )}
      overshootRight={false}
    >
      <View
        style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <GlowIconBadge icon={MEAL_ICON[meal.mealType]} color={accents.food} size={40} />
        <View style={styles.textWrap}>
          <Text style={[styles.name, { color: colors.text }]}>{meal.name}</Text>
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            {MEAL_LABEL[meal.mealType]}
          </Text>
        </View>
        <Text style={[styles.calories, { color: colors.text }]}>{meal.calories} kcal</Text>
      </View>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.sm,
  },
  textWrap: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  meta: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  calories: {
    fontSize: fontSize.sm,
    fontWeight: '700',
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
});
