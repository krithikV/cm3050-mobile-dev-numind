import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Sheet } from '../ui/Sheet';
import { Input } from '../ui/Input';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { formStyles } from '../ui/formStyles';
import { useTheme } from '../../lib/ThemeProvider';
import { spacing, fontSize, accents } from '../../lib/theme';
import { RoutineExercise } from '../../store/useFitnessStore';

const CATEGORIES = ['Cardio', 'Strength', 'Yoga', 'Sports', 'Other'];

type ExerciseRow = { name: string; category: string; targetSets: string; targetReps: string };

const emptyRow = (): ExerciseRow => ({
  name: '',
  category: CATEGORIES[1],
  targetSets: '',
  targetReps: '',
});

type RoutineFormProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: { name: string; exercises: RoutineExercise[] }) => void;
};

export function RoutineForm({ visible, onClose, onSubmit }: RoutineFormProps) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState<ExerciseRow[]>([emptyRow()]);

  const reset = () => {
    setName('');
    setExercises([emptyRow()]);
  };

  const updateRow = (i: number, updates: Partial<ExerciseRow>) => {
    setExercises((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...updates } : r)));
  };

  const handleSubmit = () => {
    const validExercises: RoutineExercise[] = exercises
      .filter((e) => e.name.trim())
      .map((e) => ({
        name: e.name.trim(),
        category: e.category,
        targetSets: e.targetSets.trim() ? parseInt(e.targetSets, 10) : undefined,
        targetReps: e.targetReps.trim() ? parseInt(e.targetReps, 10) : undefined,
      }));
    if (!name.trim() || validExercises.length === 0) return;
    onSubmit({ name: name.trim(), exercises: validExercises });
    reset();
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[formStyles.heading, { color: colors.text }]}>New routine</Text>

        <Input
          label="Routine name"
          placeholder="e.g. Leg Day"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <Text style={[formStyles.sectionLabel, { color: colors.textMuted }]}>Exercises</Text>
        {exercises.map((row, i) => (
          <View
            key={i}
            style={[styles.exerciseCard, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}
          >
            <View style={styles.exerciseHeaderRow}>
              <Input
                placeholder="Exercise name"
                value={row.name}
                onChangeText={(v) => updateRow(i, { name: v })}
                containerStyle={styles.exerciseNameInput}
              />
              <IconButton
                icon="close"
                size={16}
                onPress={() => setExercises((prev) => prev.filter((_, idx) => idx !== i))}
              />
            </View>
            <View style={styles.exerciseChipRow}>
              {CATEGORIES.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  selected={row.category === c}
                  accentColor={accents.fitness}
                  onPress={() => updateRow(i, { category: c })}
                />
              ))}
            </View>
            <View style={styles.setRow}>
              <Input
                placeholder="Target sets"
                keyboardType="number-pad"
                value={row.targetSets}
                onChangeText={(v) => updateRow(i, { targetSets: v })}
                containerStyle={styles.setInput}
              />
              <Input
                placeholder="Target reps"
                keyboardType="number-pad"
                value={row.targetReps}
                onChangeText={(v) => updateRow(i, { targetReps: v })}
                containerStyle={styles.setInput}
              />
            </View>
          </View>
        ))}

        <Pressable
          onPress={() => setExercises((prev) => [...prev, emptyRow()])}
          style={styles.addRow}
        >
          <Ionicons name="add-circle-outline" size={18} color={accents.fitness} />
          <Text style={[styles.addLabel, { color: accents.fitness }]}>Add exercise</Text>
        </Pressable>

        <View style={{ height: spacing.md }} />
        <Button
          label="Save routine"
          accentColor={accents.fitness}
          onPress={handleSubmit}
          fullWidth
        />
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  exerciseCard: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  exerciseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  exerciseNameInput: {
    flex: 1,
    marginBottom: spacing.sm,
  },
  // Tighter than the shared formStyles.chipRow (sm vs md) to keep repeating
  // exercise cards compact.
  exerciseChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  setRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  setInput: {
    flex: 1,
    marginBottom: 0,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  addLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
});
