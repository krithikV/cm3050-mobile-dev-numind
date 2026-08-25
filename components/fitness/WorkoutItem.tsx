import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { GlowIconBadge } from '../ui/GlowIconBadge';
import { useTheme } from '../../lib/ThemeProvider';
import { radius, spacing, fontSize, accents } from '../../lib/theme';
import { Workout } from '../../store/useFitnessStore';

const CATEGORY_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  Cardio: 'heart-outline',
  Strength: 'barbell-outline',
  Yoga: 'body-outline',
  Sports: 'basketball-outline',
  Other: 'fitness-outline',
};

type WorkoutItemProps = {
  workout: Workout;
  onDelete: () => void;
};

export function WorkoutItem({ workout, onDelete }: WorkoutItemProps) {
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
        <GlowIconBadge
          icon={CATEGORY_ICON[workout.category] ?? 'fitness-outline'}
          color={accents.fitness}
          size={40}
        />
        <View style={styles.textWrap}>
          <Text style={[styles.name, { color: colors.text }]}>{workout.name}</Text>
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            {workout.category} · {workout.durationMinutes}m
            {workout.caloriesBurned ? ` · ${workout.caloriesBurned} kcal` : ''}
          </Text>
        </View>
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
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
});
