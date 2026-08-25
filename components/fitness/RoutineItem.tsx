import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useTheme } from '../../lib/ThemeProvider';
import { spacing, fontSize, accents } from '../../lib/theme';
import { Routine } from '../../store/useFitnessStore';

type RoutineItemProps = {
  routine: Routine;
  onStart: () => void;
  onDelete: () => void;
  startDisabled?: boolean;
};

export function RoutineItem({ routine, onStart, onDelete, startDisabled }: RoutineItemProps) {
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
      <Card style={styles.card}>
        <Text style={[styles.name, { color: colors.text }]}>{routine.name}</Text>
        <Text style={[styles.meta, { color: colors.textMuted }]} numberOfLines={2}>
          {routine.exercises.map((e) => e.name).join(' · ')}
        </Text>
        <Button
          label="Start"
          accentColor={accents.fitness}
          variant={startDisabled ? 'secondary' : 'primary'}
          disabled={startDisabled}
          onPress={onStart}
          fullWidth
        />
      </Card>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: 2,
  },
  meta: {
    fontSize: fontSize.xs,
    marginBottom: spacing.sm,
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    borderRadius: 24,
    marginBottom: spacing.sm,
  },
});
