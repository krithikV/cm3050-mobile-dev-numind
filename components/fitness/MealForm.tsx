import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Sheet } from '../ui/Sheet';
import { Input } from '../ui/Input';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { formStyles } from '../ui/formStyles';
import { useTheme } from '../../lib/ThemeProvider';
import { accents } from '../../lib/theme';
import { MealType } from '../../store/useFitnessStore';
import { dateKey } from '../../lib/date';

const MEAL_TYPES: { value: MealType; label: string }[] = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

type MealFormProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: {
    name: string;
    mealType: MealType;
    calories: number;
    date: string;
  }) => void;
};

export function MealForm({ visible, onClose, onSubmit }: MealFormProps) {
  const { colors } = useTheme();
  const [name, setName] = useState('');
  const [mealType, setMealType] = useState<MealType>('breakfast');
  const [calories, setCalories] = useState('');

  const reset = () => {
    setName('');
    setMealType('breakfast');
    setCalories('');
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    const parsedCalories = parseInt(calories, 10) || 0;
    onSubmit({ name: name.trim(), mealType, calories: parsedCalories, date: dateKey() });
    reset();
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[formStyles.heading, { color: colors.text }]}>Log food</Text>

        <Input
          label="Food"
          placeholder="e.g. Grilled chicken salad"
          value={name}
          onChangeText={setName}
          autoFocus
        />

        <Text style={[formStyles.sectionLabel, { color: colors.textMuted }]}>Meal</Text>
        <View style={formStyles.chipRow}>
          {MEAL_TYPES.map((m) => (
            <Chip
              key={m.value}
              label={m.label}
              selected={mealType === m.value}
              accentColor={accents.food}
              onPress={() => setMealType(m.value)}
            />
          ))}
        </View>

        <Input
          label="Calories"
          placeholder="450"
          keyboardType="number-pad"
          value={calories}
          onChangeText={setCalories}
        />

        <Button label="Add food" accentColor={accents.food} onPress={handleSubmit} fullWidth />
      </ScrollView>
    </Sheet>
  );
}
