import { useEffect } from 'react';
import { Alert } from 'react-native';

// Expo Go (Android, SDK 53+) does not support expo-notifications for local
// scheduling without a custom dev build, so hydration reminders are done
// purely in JS: a foreground-only interval timer + Alert while the app is
// open. This keeps the whole project runnable in plain Expo Go with no
// native modules that require a dev client.
export function useHydrationReminder(enabled: boolean, intervalMinutes: number) {
  useEffect(() => {
    if (!enabled) return;
    const ms = Math.max(1, intervalMinutes) * 60 * 1000;
    const id = setInterval(() => {
      Alert.alert(
        'Time to hydrate 💧',
        "It's been a while — top up your water intake."
      );
    }, ms);
    return () => clearInterval(id);
  }, [enabled, intervalMinutes]);
}
