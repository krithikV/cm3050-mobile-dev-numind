import React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '../lib/ThemeProvider';
import { useHydrationReminder } from '../lib/hydrationReminder';
import { useAlarmChecker } from '../lib/alarmChecker';
import { useSettingsStore } from '../store/useSettingsStore';

function RootStack() {
  const { mode, colors } = useTheme();
  const hydrationRemindersEnabled = useSettingsStore((s) => s.hydrationRemindersEnabled);
  const hydrationReminderMinutes = useSettingsStore((s) => s.hydrationReminderMinutes);
  useHydrationReminder(hydrationRemindersEnabled, hydrationReminderMinutes);
  useAlarmChecker();

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootStack />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
