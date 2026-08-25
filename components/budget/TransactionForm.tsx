import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Sheet } from '../ui/Sheet';
import { Input } from '../ui/Input';
import { Chip } from '../ui/Chip';
import { Button } from '../ui/Button';
import { SegmentedControl } from '../ui/SegmentedControl';
import { formStyles } from '../ui/formStyles';
import { useTheme } from '../../lib/ThemeProvider';
import { spacing, fontSize, accents } from '../../lib/theme';
import { Transaction, TransactionType, Category } from '../../store/useBudgetStore';
import { dateKey } from '../../lib/date';
import { parsePositiveAmount } from '../../lib/format';
import { format, parseISO } from 'date-fns';

type TransactionFormProps = {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (input: {
    type: TransactionType;
    amount: number;
    category: string;
    note: string;
    date: string;
    recurring?: boolean;
  }) => void;
  initial?: Transaction | null;
};

export function TransactionForm({
  visible,
  onClose,
  categories,
  onSubmit,
  initial,
}: TransactionFormProps) {
  const { colors } = useTheme();
  const [type, setType] = useState<TransactionType>(initial?.type ?? 'expense');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const categoriesForType = (t: TransactionType) =>
    categories.filter((c) => c.type === t).map((c) => c.name);
  const [category, setCategory] = useState(
    initial?.category ?? categoriesForType('expense')[0] ?? ''
  );
  const [note, setNote] = useState(initial?.note ?? '');
  const [date, setDate] = useState<Date>(
    initial ? parseISO(initial.date) : new Date()
  );
  const [showPicker, setShowPicker] = useState(false);
  const [recurring, setRecurring] = useState(initial?.recurring ?? false);

  const currentCategories = categoriesForType(type);

  const handleTypeChange = (value: string) => {
    const next = value as TransactionType;
    setType(next);
    const options = categoriesForType(next);
    setCategory(options[0] ?? '');
  };

  const reset = () => {
    setAmount('');
    setNote('');
    setType('expense');
    setCategory(categoriesForType('expense')[0] ?? '');
    setDate(new Date());
    setRecurring(false);
  };

  const handleSubmit = () => {
    const parsed = parsePositiveAmount(amount);
    if (!parsed || !category) return;
    onSubmit({
      type,
      amount: parsed,
      category,
      note: note.trim(),
      date: dateKey(date),
      recurring,
    });
    reset();
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[formStyles.heading, { color: colors.text }]}>
          {initial ? 'Edit transaction' : 'New transaction'}
        </Text>

        <SegmentedControl
          segments={[
            { label: 'Expense', value: 'expense' },
            { label: 'Income', value: 'income' },
          ]}
          value={type}
          onChange={handleTypeChange}
          accentColor={accents.budget}
        />

        <View style={{ height: spacing.md }} />

        <Input
          label="Amount"
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={[formStyles.sectionLabel, { color: colors.textMuted }]}>Category</Text>
        <View style={formStyles.chipRow}>
          {currentCategories.length === 0 ? (
            <Text style={[styles.emptyNote, { color: colors.textMuted }]}>
              No categories yet — add one from the Budgets tab.
            </Text>
          ) : (
            currentCategories.map((c) => (
              <Chip
                key={c}
                label={c}
                selected={category === c}
                accentColor={accents.budget}
                onPress={() => setCategory(c)}
              />
            ))
          )}
        </View>

        <Text style={[formStyles.sectionLabel, { color: colors.textMuted }]}>Date</Text>
        <View style={formStyles.chipRow}>
          <Chip
            label={format(date, 'MMM d, yyyy')}
            selected
            accentColor={accents.budget}
            onPress={() => setShowPicker(true)}
          />
        </View>
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(_, selected) => {
              setShowPicker(false);
              if (selected) setDate(selected);
            }}
          />
        )}

        <Text style={[formStyles.sectionLabel, { color: colors.textMuted }]}>Repeats</Text>
        <View style={formStyles.chipRow}>
          <Chip
            label="One-time"
            selected={!recurring}
            accentColor={accents.budget}
            onPress={() => setRecurring(false)}
          />
          <Chip
            label="Monthly"
            selected={recurring}
            accentColor={accents.budget}
            onPress={() => setRecurring(true)}
          />
        </View>

        <Input
          label="Note (optional)"
          placeholder="Add a note"
          value={note}
          onChangeText={setNote}
        />

        <Button
          label={initial ? 'Save changes' : type === 'expense' ? 'Add expense' : 'Add income'}
          accentColor={accents.budget}
          onPress={handleSubmit}
          disabled={!category}
          fullWidth
        />
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  emptyNote: {
    fontSize: fontSize.sm,
  },
});
