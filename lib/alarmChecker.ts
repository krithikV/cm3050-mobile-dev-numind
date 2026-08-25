import { useEffect } from 'react';
import { Alert } from 'react-native';
import { useAlarmsStore, dueAlarms } from '../store/useAlarmsStore';
import { dateKey } from './date';

// Same foreground-only approach as lib/hydrationReminder.ts: expo-notifications
// can't be used without breaking Expo Go on Android (SDK 53+), so alarms are
// checked on a timer while the app is open rather than scheduled with the OS.
const CHECK_INTERVAL_MS = 20_000;

export function useAlarmChecker() {
  useEffect(() => {
    const check = () => {
      const now = new Date();
      const today = dateKey(now);
      // Read fresh state each tick rather than subscribing — this checker
      // doesn't render anything, so there's no reason to tear down and
      // rebuild the interval every time an alarm is added/edited/toggled.
      const { alarms, markFired } = useAlarmsStore.getState();
      for (const alarm of dueAlarms(alarms, now, today)) {
        markFired(alarm.id, today);
        Alert.alert('Alarm', alarm.label);
      }
    };

    check();
    const id = setInterval(check, CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);
}
