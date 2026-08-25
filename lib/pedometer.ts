import { Pedometer } from 'expo-sensors';
import { Platform } from 'react-native';
import { useEffect, useRef, useState } from 'react';

const IOS_POLL_INTERVAL_MS = 30_000;

export async function isPedometerAvailable(): Promise<boolean> {
  try {
    return await Pedometer.isAvailableAsync();
  } catch {
    return false;
  }
}

export async function requestPedometerPermissions(): Promise<boolean> {
  try {
    const current = await Pedometer.getPermissionsAsync();
    if (current.granted) return true;
    const result = await Pedometer.requestPermissionsAsync();
    return result.granted;
  } catch {
    return false;
  }
}

// iOS only — Apple exposes a real historical query, so we reconcile today's
// logged total against the device's actual count once per visit.
async function getTodayStepCountIOS(): Promise<number | null> {
  if (Platform.OS !== 'ios') return null;
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const result = await Pedometer.getStepCountAsync(start, new Date());
    return result.steps;
  } catch {
    return null;
  }
}

/**
 * Android has no historical query — only a live delta stream while the app
 * is foregrounded. This hook calls `onDelta` with the incremental step count
 * each time the sensor reports, so callers can log it the same way a manual
 * quick-add button would.
 */
function useLiveStepDeltas(enabled: boolean, onDelta: (delta: number) => void) {
  const previousRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled || Platform.OS !== 'android') return;

    previousRef.current = null;
    let cancelled = false;

    const subscription = Pedometer.watchStepCount(({ steps }) => {
      if (cancelled) return;
      if (previousRef.current === null) {
        previousRef.current = steps;
        return;
      }
      const delta = steps - previousRef.current;
      previousRef.current = steps;
      if (delta > 0) onDelta(delta);
    });

    return () => {
      cancelled = true;
      subscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}

/**
 * Orchestrates step tracking end-to-end so screens don't need to know about
 * the iOS-poll vs. Android-delta split: checks sensor availability, exposes
 * explicit start/stop, and feeds `onSteps` from whichever platform strategy
 * applies while tracking is on. `active` gates tracking off (e.g. the
 * screen is showing a past day, where "live" steps make no sense).
 */
export function useStepTracking(active: boolean, onSteps: (amount: number) => void) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [tracking, setTracking] = useState(false);
  const [starting, setStarting] = useState(false);
  const todayStepsRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    isPedometerAvailable().then((result) => {
      if (!cancelled) setAvailable(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!active) setTracking(false);
  }, [active]);

  useLiveStepDeltas(tracking, onSteps);

  useEffect(() => {
    if (!tracking || Platform.OS !== 'ios') return;

    const reconcile = () => {
      getTodayStepCountIOS().then((deviceTotal) => {
        if (deviceTotal !== null && deviceTotal > todayStepsRef.current) {
          onSteps(deviceTotal - todayStepsRef.current);
        }
      });
    };

    reconcile();
    const id = setInterval(reconcile, IOS_POLL_INTERVAL_MS);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tracking]);

  const start = async () => {
    setStarting(true);
    const granted = await requestPedometerPermissions();
    setStarting(false);
    if (granted) setTracking(true);
  };

  const stop = () => setTracking(false);

  return {
    available,
    tracking,
    starting,
    start,
    stop,
    // The iOS poll needs to know "today's total so far" to compute a delta —
    // callers update this each render so the closure above stays current.
    setKnownTotal: (total: number) => {
      todayStepsRef.current = total;
    },
  };
}
