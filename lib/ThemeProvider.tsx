import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { themes, ThemeColors, ThemeMode } from './theme';
import { useSettingsStore } from '../store/useSettingsStore';

type ThemeContextValue = {
  colors: ThemeColors;
  mode: ThemeMode;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const themePreference = useSettingsStore((s) => s.themePreference);

  const mode: ThemeMode =
    themePreference === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : themePreference;

  const value = useMemo<ThemeContextValue>(
    () => ({ colors: themes[mode], mode }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider');
  return ctx;
}
