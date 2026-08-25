import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageKeys } from '../lib/storage';
import { dateKey } from '../lib/date';

export type MoodEntry = {
  date: string; // yyyy-MM-dd, one entry per day
  score: 1 | 2 | 3 | 4 | 5;
  note: string;
  updatedAt: string;
};

type MoodState = {
  entries: MoodEntry[];
  upsertEntry: (date: string, score: MoodEntry['score'], note: string) => void;
  deleteEntry: (date: string) => void;
};

export const useMoodStore = create<MoodState>()(
  persist(
    (set, get) => ({
      entries: [],
      upsertEntry: (date, score, note) => {
        const existing = get().entries.find((e) => e.date === date);
        const updatedAt = new Date().toISOString();
        if (existing) {
          set({
            entries: get().entries.map((e) =>
              e.date === date ? { ...e, score, note, updatedAt } : e
            ),
          });
        } else {
          set({ entries: [{ date, score, note, updatedAt }, ...get().entries] });
        }
      },
      deleteEntry: (date) =>
        set({ entries: get().entries.filter((e) => e.date !== date) }),
    }),
    {
      name: storageKeys.mood,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function getMoodStreak(entries: MoodEntry[]): number {
  const dates = new Set(entries.map((e) => e.date));
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = dateKey(cursor);
    if (!dates.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function lastNDaysEntries(entries: MoodEntry[], n: number): (MoodEntry | null)[] {
  const byDate = new Map(entries.map((e) => [e.date, e]));
  const result: (MoodEntry | null)[] = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - (n - 1));
  for (let i = 0; i < n; i++) {
    const key = dateKey(cursor);
    result.push(byDate.get(key) ?? null);
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
}
