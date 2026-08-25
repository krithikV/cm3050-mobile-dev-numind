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
import { Priority, Task } from '../../store/useTaskStore';
import { format } from 'date-fns';

const CATEGORIES = ['Personal', 'Work', 'Health', 'Errands', 'Study'];
const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

type TaskFormProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: {
    title: string;
    category: string;
    priority: Priority;
    dueAt: string | null;
  }) => void;
  initial?: Task | null;
};

export function TaskForm({ visible, onClose, onSubmit, initial }: TaskFormProps) {
  const { colors } = useTheme();
  const [title, setTitle] = useState(initial?.title ?? '');
  const [category, setCategory] = useState(initial?.category ?? CATEGORIES[0]);
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'medium');
  const [dueEnabled, setDueEnabled] = useState(!!initial?.dueAt);
  const [dueDate, setDueDate] = useState<Date>(
    initial?.dueAt ? new Date(initial.dueAt) : new Date(Date.now() + 60 * 60 * 1000)
  );
  // Android's native picker only supports 'date' or 'time' individually — a
  // combined 'datetime' mode crashes on unmount there. iOS supports the
  // combined spinner directly, so Android chains date -> time instead.
  const [pickerStep, setPickerStep] = useState<'date' | 'time' | 'datetime' | null>(
    null
  );

  const reset = () => {
    setTitle('');
    setCategory(CATEGORIES[0]);
    setPriority('medium');
    setDueEnabled(false);
    setDueDate(new Date(Date.now() + 60 * 60 * 1000));
    setPickerStep(null);
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      title: title.trim(),
      category,
      priority,
      dueAt: dueEnabled ? dueDate.toISOString() : null,
    });
    reset();
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[formStyles.heading, { color: colors.text }]}>
          {initial ? 'Edit task' : 'New task'}
        </Text>

        <Input
          label="Title"
          placeholder="e.g. Finish project report"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />

        <Text style={[formStyles.sectionLabel, { color: colors.textMuted }]}>Category</Text>
        <View style={formStyles.chipRow}>
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              label={c}
              selected={category === c}
              accentColor={accents.tasks}
              onPress={() => setCategory(c)}
            />
          ))}
        </View>

        <Text style={[formStyles.sectionLabel, { color: colors.textMuted }]}>Priority</Text>
        <View style={formStyles.chipRow}>
          {PRIORITIES.map((p) => (
            <Chip
              key={p}
              label={p[0].toUpperCase() + p.slice(1)}
              selected={priority === p}
              accentColor={accents.tasks}
              onPress={() => setPriority(p)}
            />
          ))}
        </View>

        <Text style={[formStyles.sectionLabel, { color: colors.textMuted }]}>Due date</Text>
        <View style={formStyles.chipRow}>
          <Chip
            label="No due date"
            selected={!dueEnabled}
            accentColor={accents.tasks}
            onPress={() => setDueEnabled(false)}
          />
          <Chip
            label={dueEnabled ? format(dueDate, 'MMM d, h:mm a') : 'Set date & time'}
            selected={dueEnabled}
            accentColor={accents.tasks}
            onPress={() => {
              setDueEnabled(true);
              setPickerStep(Platform.OS === 'ios' ? 'datetime' : 'date');
            }}
          />
        </View>

        {pickerStep && (
          <DateTimePicker
            value={dueDate}
            mode={pickerStep}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selected) => {
              if (Platform.OS === 'ios') {
                setPickerStep(null);
                if (selected) setDueDate(selected);
                return;
              }
              if (!selected) {
                setPickerStep(null);
                return;
              }
              if (pickerStep === 'date') {
                const merged = new Date(dueDate);
                merged.setFullYear(
                  selected.getFullYear(),
                  selected.getMonth(),
                  selected.getDate()
                );
                setDueDate(merged);
                setPickerStep('time');
              } else {
                const merged = new Date(dueDate);
                merged.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
                setDueDate(merged);
                setPickerStep(null);
              }
            }}
          />
        )}

        <View style={{ height: spacing.md }} />
        <Button
          label={initial ? 'Save changes' : 'Add task'}
          accentColor={accents.tasks}
          onPress={handleSubmit}
          fullWidth
        />
      </ScrollView>
    </Sheet>
  );
}
