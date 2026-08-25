import React, { useState } from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Sheet } from '../ui/Sheet';
import { Input } from '../ui/Input';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { formStyles } from '../ui/formStyles';
import { useTheme } from '../../lib/ThemeProvider';
import { spacing, accents } from '../../lib/theme';
import { dateKey } from '../../lib/date';
import { parsePositiveAmount } from '../../lib/format';
import { format, parseISO } from 'date-fns';
import { SavingsGoal } from '../../store/useBudgetStore';

type GoalFormProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: { name: string; targetAmount: number; targetDate: string | null }) => void;
  initial?: SavingsGoal | null;
};

export function GoalForm({ visible, onClose, onSubmit, initial }: GoalFormProps) {
  const { colors } = useTheme();
  const [name, setName] = useState(initial?.name ?? '');
  const [targetAmount, setTargetAmount] = useState(
    initial ? String(initial.targetAmount) : ''
  );
  const [hasDate, setHasDate] = useState(!!initial?.targetDate);
  const [targetDate, setTargetDate] = useState(
    initial?.targetDate ? parseISO(initial.targetDate) : new Date()
  );
  const [showPicker, setShowPicker] = useState(false);

  const reset = () => {
    setName('');
    setTargetAmount('');
    setHasDate(false);
    setTargetDate(new Date());
  };

  const handleSubmit = () => {
    const parsed = parsePositiveAmount(targetAmount);
    if (!name.trim() || !parsed) return;
    onSubmit({
      name: name.trim(),
      targetAmount: parsed,
      targetDate: hasDate ? dateKey(targetDate) : null,
    });
    reset();
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[formStyles.heading, { color: colors.text }]}>
          {initial ? 'Edit savings goal' : 'New savings goal'}
        </Text>

        <Input
          label="Goal name"
          placeholder="e.g. Emergency fund"
          value={name}
          onChangeText={setName}
          autoFocus
        />
        <Input
          label="Target amount"
          placeholder="500"
          keyboardType="decimal-pad"
          value={targetAmount}
          onChangeText={setTargetAmount}
        />

        <Text style={[formStyles.sectionLabel, { color: colors.textMuted }]}>Target date</Text>
        <View style={formStyles.chipRow}>
          <Chip
            label="No target date"
            selected={!hasDate}
            accentColor={accents.budget}
            onPress={() => setHasDate(false)}
          />
          <Chip
            label={hasDate ? format(targetDate, 'MMM d, yyyy') : 'Set a date'}
            selected={hasDate}
            accentColor={accents.budget}
            onPress={() => {
              setHasDate(true);
              setShowPicker(true);
            }}
          />
        </View>
        {showPicker && (
          <DateTimePicker
            value={targetDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={new Date()}
            onChange={(_, selected) => {
              setShowPicker(false);
              if (selected) setTargetDate(selected);
            }}
          />
        )}

        <View style={{ height: spacing.md }} />
        <Button
          label={initial ? 'Save changes' : 'Create goal'}
          accentColor={accents.budget}
          onPress={handleSubmit}
          fullWidth
        />
      </ScrollView>
    </Sheet>
  );
}
