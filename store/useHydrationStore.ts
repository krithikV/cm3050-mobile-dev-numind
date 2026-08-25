import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageKeys } from '../lib/storage';
import { dateKey } from '../lib/date';
import { newId } from '../lib/id';

export type WaterLog = {
  id: string;
  date: string; // yyyy-MM-dd
  amountMl: number;
  loggedAt: string;
};

type HydrationState = {
  logs: WaterLog[];
  addLog: (amountMl: number) => void;
  removeLog: (id: string) => void;
};

export const useHydrationStore = create<HydrationState>()(
  persist(
    (set, get) => ({
      logs: [],
      addLog: (amountMl) => {
        const log: WaterLog = {
          id: newId(),
          date: dateKey(),
          amountMl,
          loggedAt: new Date().toISOString(),
        };
        set({ logs: [log, ...get().logs] });
      },
      removeLog: (id) => set({ logs: get().logs.filter((l) => l.id !== id) }),
    }),
    {
      name: storageKeys.hydration,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function totalForDate(logs: WaterLog[], date: string): number {
  return logs.filter((l) => l.date === date).reduce((sum, l) => sum + l.amountMl, 0);
}

export function todaysTotal(logs: WaterLog[]): number {
  return totalForDate(logs, dateKey());
}

export function logsForDate(logs: WaterLog[], date: string): WaterLog[] {
  return logs
    .filter((l) => l.date === date)
    .sort((a, b) => b.loggedAt.localeCompare(a.loggedAt));
}
