import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { addDays, format } from 'date-fns';
import { Screen } from '../../components/ui/Screen';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { DateNavigator } from '../../components/ui/DateNavigator';
import { MoodSelector } from '../../components/mood/MoodSelector';
import { MoodHistoryChart } from '../../components/mood/MoodHistoryChart';
import { useMoodStore, getMoodStreak } from '../../store/useMoodStore';
import { dateKey } from '../../lib/date';
import { accents, spacing, fontSize } from '../../lib/theme';
import { useTheme } from '../../lib/ThemeProvider';

export default function MoodScreen() {
  const { colors } = useTheme();
  const entries = useMoodStore((s) => s.entries);
  const upsertEntry = useMoodStore((s) => s.upsertEntry);

  const [dayOffset, setDayOffset] = useState(0);
  const isToday = dayOffset === 0;
  const selectedDate = addDays(new Date(), dayOffset);
  const selectedDateKey = dateKey(selectedDate);
  const selectedEntry = entries.find((e) => e.date === selectedDateKey);

  const [score, setScore] = useState<number | null>(selectedEntry?.score ?? null);
  const [note, setNote] = useState(selectedEntry?.note ?? '');

  // Local form state only reflects the entry at first mount — resync it
  // whenever the selected day changes instead.
  useEffect(() => {
    setScore(selectedEntry?.score ?? null);
    setNote(selectedEntry?.note ?? '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDateKey]);

  const streak = useMemo(() => getMoodStreak(entries), [entries]);

  const handleSave = () => {
    if (!score) return;
    upsertEntry(selectedDateKey, score, note.trim());
  };

  return (
    <Screen title="Mood" subtitle="How are you feeling?">
      <DateNavigator
        label={isToday ? 'Today' : format(selectedDate, 'EEE, MMM d')}
        onPrev={() => setDayOffset((o) => o - 1)}
        onNext={() => setDayOffset((o) => Math.min(0, o + 1))}
        nextDisabled={isToday}
      />

      <Card style={{ marginBottom: spacing.md }}>
        <MoodSelector value={score} onChange={setScore} />
        <View style={{ height: spacing.md }} />
        <Input
          label="Journal (optional)"
          placeholder="What's on your mind?"
          value={note}
          onChangeText={setNote}
          multiline
          style={{ minHeight: 60, textAlignVertical: 'top' }}
        />
        <Button
          label={selectedEntry ? 'Update check-in' : 'Save check-in'}
          accentColor={accents.mood}
          onPress={handleSave}
          disabled={!score}
          fullWidth
        />
      </Card>

      <View style={styles.streakRow}>
        <Text style={styles.streakEmoji}>🔥</Text>
        <Text style={[styles.streakText, { color: colors.text }]}>
          {streak} day{streak === 1 ? '' : 's'} streak
        </Text>
      </View>

      <Card>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Last 7 days</Text>
        <MoodHistoryChart entries={entries} days={7} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },
  streakEmoji: {
    fontSize: fontSize.lg,
    marginRight: spacing.xs,
  },
  streakText: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
});
