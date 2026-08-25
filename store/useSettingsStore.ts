import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageKeys } from '../lib/storage';

export type ThemePreference = 'system' | 'light' | 'dark';

type SettingsState = {
  displayName: string;
  themePreference: ThemePreference;
  hydrationGoalMl: number;
  hydrationReminderMinutes: number;
  hydrationRemindersEnabled: boolean;
  stepGoal: number;
  dailyCalorieGoal: number;
  setDisplayName: (name: string) => void;
  setThemePreference: (pref: ThemePreference) => void;
  setHydrationGoalMl: (ml: number) => void;
  setHydrationReminderMinutes: (minutes: number) => void;
  setHydrationRemindersEnabled: (enabled: boolean) => void;
  setStepGoal: (steps: number) => void;
  setDailyCalorieGoal: (calories: number) => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      displayName: '',
      themePreference: 'system',
      hydrationGoalMl: 2000,
      hydrationReminderMinutes: 90,
      hydrationRemindersEnabled: false,
      stepGoal: 8000,
      dailyCalorieGoal: 2000,
      // Not trimmed here — this feeds a controlled text input, and trimming
      // on every keystroke would strip a trailing space the instant it's
      // typed (e.g. between a first and last name), fighting the user mid-
      // type. Trim at the point of use (greeting, etc.) instead.
      setDisplayName: (displayName) => set({ displayName }),
      setThemePreference: (themePreference) => set({ themePreference }),
      setHydrationGoalMl: (hydrationGoalMl) => set({ hydrationGoalMl }),
      setHydrationReminderMinutes: (hydrationReminderMinutes) =>
        set({ hydrationReminderMinutes }),
      setHydrationRemindersEnabled: (hydrationRemindersEnabled) =>
        set({ hydrationRemindersEnabled }),
      setStepGoal: (stepGoal) => set({ stepGoal }),
      setDailyCalorieGoal: (dailyCalorieGoal) => set({ dailyCalorieGoal }),
    }),
    {
      name: storageKeys.settings,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
