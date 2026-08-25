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
import { spacing, fontSize, accents, radius } from '../../lib/theme';
import { dateKey } from '../../lib/date';
import { WorkoutSet } from '../../store/useFitnessStore';

const CATEGORIES = ['Cardio', 'Strength', 'Yoga', 'Sports', 'Other'];

type SetRow = { reps: string; weightKg: string };

type WorkoutFormProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: {
    name: string;
    category: string;
    durationMinutes: number;
    caloriesBurned: number;
    date: string;
    sets?: WorkoutSet[];
    distanceKm?: number;
  }) => void;
  initial?: { name: string; category: string } | null;
};

export function WorkoutForm({ visible, onClose, onSubmit, initial }: WorkoutFormProps) {
  const { colors } = useTheme();
  const [name, setName] = useState(initial?.name ?? '');
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0]);
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [distance, setDistance] = useState('');
  const [sets, setSets] = useState<SetRow[]>([{ reps: '', weightKg: '' }]);

  const reset = () => {
    setName('');
    setCategory(CATEGORIES[0]);
    setDuration('');
    setCalories('');
    setDistance('');
    setSets([{ reps: '', weightKg: '' }]);
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    const durationMinutes = parseInt(duration, 10) || 0;
    const caloriesBurned = parseInt(calories, 10) || 0;
    const parsedSets: WorkoutSet[] = sets
      .filter((s) => s.reps.trim() && s.weightKg.trim())
      .map((s) => ({ reps: parseInt(s.reps, 10) || 0, weightKg: parseFloat(s.weightKg) || 0 }));
    const parsedDistance = parseFloat(distance);

    onSubmit({
      name: name.trim(),
      category,
      durationMinutes,
      caloriesBurned,
      date: dateKey(),
      sets: category === 'Strength' && parsedSets.length > 0 ? parsedSets : undefined,
      distanceKm: category === 'Cardio' && parsedDistance > 0 ? parsedDistance : undefined,
    });
    reset();
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[formStyles.heading, { color: colors.text }]}>Log workout</Text>

        <Input
          label="Workout"
          placeholder="e.g. Leg day"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <Text style={[formStyles.sectionLabel, { color: colors.textMuted }]}>Category</Text>
        <View style={formStyles.chipRow}>
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={c}
              selected={category === c}
              accentColor={accents.fitness}
              onPress={() => setCategory(c)}
            />
          ))}
        </View>

        <Input
          label="Duration (minutes)"
          placeholder="30"
          keyboardType="number-pad"
          value={duration}
          onChangeText={setDuration}
        />
        <Input
          label="Calories burned (optional)"
          placeholder="200"
          keyboardType="number-pad"
          value={calories}
          onChangeText={setCalories}
        />

        {category === 'Cardio' && (
          <Input
            label="Distance (km, optional)"
            placeholder="5"
            keyboardType="decimal-pad"
            value={distance}
            onChangeText={setDistance}
          />
        )}

        {category === 'Strength' && (
          <View style={{ marginBottom: spacing.md }}>
            <Text style={[formStyles.sectionLabel, { color: colors.textMuted }]}>Sets</Text>
            {sets.map((row, i) => (
              <View key={i} style={styles.setRow}>
                <Input
                  placeholder="Reps"
                  keyboardType="number-pad"
                  value={row.reps}
                  onChangeText={(v) =>
                    setSets((prev) => prev.map((s, idx) => (idx === i ? { ...s, reps: v } : s)))
                  }
                  containerStyle={styles.setInput}
                />
                <Input
                  placeholder="Weight (kg)"
                  keyboardType="decimal-pad"
                  value={row.weightKg}
                  onChangeText={(v) =>
                    setSets((prev) =>
                      prev.map((s, idx) => (idx === i ? { ...s, weightKg: v } : s))
                    )
                  }
                  containerStyle={styles.setInput}
                />
                <IconButton
                  icon="close"
                  size={16}
                  onPress={() => setSets((prev) => prev.filter((_, idx) => idx !== i))}
                />
              </View>
            ))}
            <Pressable
              onPress={() => setSets((prev) => [...prev, { reps: '', weightKg: '' }])}
              style={styles.addSetRow}
            >
              <Ionicons name="add-circle-outline" size={18} color={accents.fitness} />
              <Text style={[styles.addSetLabel, { color: accents.fitness }]}>Add set</Text>
            </Pressable>
          </View>
        )}

        <Button
          label="Add workout"
          accentColor={accents.fitness}
          onPress={handleSubmit}
          fullWidth
        />
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  setInput: {
    flex: 1,
    marginBottom: spacing.sm,
  },
  addSetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  addSetLabel: {
    fontSize: fontSize.sm,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
});
