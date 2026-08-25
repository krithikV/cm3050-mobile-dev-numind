import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { newId } from '../lib/id';
import { storageKeys } from '../lib/storage';

export type Alarm = {
  id: string;
  label: string;
  hour: number; // 0-23
  minute: number; // 0-59
  enabled: boolean;
  lastFiredDate: string | null; // yyyy-MM-dd, guards against firing more than once a day
};

type AlarmsState = {
  alarms: Alarm[];
  addAlarm: (input: { label: string; hour: number; minute: number }) => void;
  updateAlarm: (id: string, updates: Partial<Pick<Alarm, 'label' | 'hour' | 'minute'>>) => void;
  toggleAlarm: (id: string, enabled: boolean) => void;
  deleteAlarm: (id: string) => void;
  markFired: (id: string, date: string) => void;
};

export const useAlarmsStore = create<AlarmsState>()(
  persist(
    (set, get) => ({
      alarms: [],
      addAlarm: (input) => {
        const alarm: Alarm = {
          ...input,
          id: newId(),
          enabled: true,
          lastFiredDate: null,
        };
        set({ alarms: [alarm, ...get().alarms] });
      },
      updateAlarm: (id, updates) =>
        set({
          alarms: get().alarms.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        }),
      toggleAlarm: (id, enabled) =>
        set({ alarms: get().alarms.map((a) => (a.id === id ? { ...a, enabled } : a)) }),
      deleteAlarm: (id) => set({ alarms: get().alarms.filter((a) => a.id !== id) }),
      markFired: (id, date) =>
        set({
          alarms: get().alarms.map((a) =>
            a.id === id ? { ...a, lastFiredDate: date } : a
          ),
        }),
    }),
    {
      name: storageKeys.alarms,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Foreground-only: fires once the app has been open past the alarm's time
// on a day it hasn't fired yet — not a true background OS alarm (see
// lib/alarmChecker.ts for why).
export function dueAlarms(alarms: Alarm[], now: Date, today: string): Alarm[] {
  return alarms.filter(
    (a) =>
      a.enabled &&
      a.lastFiredDate !== today &&
      (now.getHours() > a.hour ||
        (now.getHours() === a.hour && now.getMinutes() >= a.minute))
  );
}
