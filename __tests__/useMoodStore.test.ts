import { useMoodStore, getMoodStreak, lastNDaysEntries, MoodEntry } from '../store/useMoodStore';
import { dateKey } from '../lib/date';

describe('useMoodStore', () => {
  beforeEach(() => {
    useMoodStore.setState({ entries: [] });
  });

  it('inserts a new entry for a date', () => {
    useMoodStore.getState().upsertEntry('2026-01-01', 4, 'Good day');
    expect(useMoodStore.getState().entries).toHaveLength(1);
    expect(useMoodStore.getState().entries[0].score).toBe(4);
  });

  it('overwrites the existing entry for the same date instead of duplicating', () => {
    useMoodStore.getState().upsertEntry('2026-01-01', 4, 'Good day');
    useMoodStore.getState().upsertEntry('2026-01-01', 2, 'Actually rough');
    const entries = useMoodStore.getState().entries;
    expect(entries).toHaveLength(1);
    expect(entries[0].score).toBe(2);
    expect(entries[0].note).toBe('Actually rough');
  });

  it('deletes an entry', () => {
    useMoodStore.getState().upsertEntry('2026-01-01', 4, '');
    useMoodStore.getState().deleteEntry('2026-01-01');
    expect(useMoodStore.getState().entries).toHaveLength(0);
  });
});

describe('getMoodStreak', () => {
  it('is 0 with no entries', () => {
    expect(getMoodStreak([])).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const entries: MoodEntry[] = [
      { date: dateKey(today), score: 3, note: '', updatedAt: '' },
      { date: dateKey(yesterday), score: 3, note: '', updatedAt: '' },
      { date: dateKey(twoDaysAgo), score: 3, note: '', updatedAt: '' },
    ];
    expect(getMoodStreak(entries)).toBe(3);
  });

  it('breaks the streak on a gap', () => {
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const entries: MoodEntry[] = [
      { date: dateKey(today), score: 3, note: '', updatedAt: '' },
      { date: dateKey(threeDaysAgo), score: 3, note: '', updatedAt: '' },
    ];
    expect(getMoodStreak(entries)).toBe(1);
  });
});

describe('lastNDaysEntries', () => {
  it('returns n slots, filling gaps with null', () => {
    const today = new Date();
    const entries: MoodEntry[] = [{ date: dateKey(today), score: 5, note: '', updatedAt: '' }];
    const slots = lastNDaysEntries(entries, 7);
    expect(slots).toHaveLength(7);
    expect(slots[6]?.score).toBe(5);
    expect(slots.slice(0, 6).every((s) => s === null)).toBe(true);
  });
});
