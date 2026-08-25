export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 26,
  xxl: 32,
} as const;

// One bold accent per module, shared across light/dark, inspired by the
// glowing icon-badge reference design.
export const accents = {
  tasks: '#B4E033', // lime — brand color
  mood: '#9A7FE6', // purple
  hydration: '#4FB8F0', // bright blue
  fitness: '#F5945C', // orange
  food: '#F2617A', // coral/pink
  steps: '#2FB88A', // teal
  budget: '#E8B33D', // amber
  coral: '#F2617A',
} as const;

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  textInverse: string;
  danger: string;
  success: string;
  overlay: string;
  tabBarBackground: string;
  tasks: string;
  mood: string;
  hydration: string;
  fitness: string;
  food: string;
  steps: string;
  budget: string;
  coral: string;
};

const lightColors: ThemeColors = {
  background: '#F5F6EE',
  surface: '#FFFFFF',
  surfaceAlt: '#F0F1E6',
  border: '#E7E9DB',
  text: '#171A14',
  textMuted: '#767A6C',
  textInverse: '#FFFFFF',
  danger: '#E5566E',
  success: '#2FB88A',
  overlay: 'rgba(15, 17, 10, 0.45)',
  tabBarBackground: '#FFFFFF',
  ...accents,
};

const darkColors: ThemeColors = {
  background: '#14160F',
  surface: '#1D2017',
  surfaceAlt: '#262A1D',
  border: '#343924',
  text: '#F2F3EA',
  textMuted: '#9BA091',
  textInverse: '#14160F',
  danger: '#EF7A8E',
  success: '#5FCBA6',
  overlay: 'rgba(0, 0, 0, 0.6)',
  tabBarBackground: '#1D2017',
  tasks: '#C7E85C',
  mood: '#B3A2F2',
  hydration: '#79C7F5',
  fitness: '#F7AB7C',
  food: '#F5849A',
  steps: '#59D1A8',
  budget: '#F0CC6B',
  coral: '#F5849A',
};

export const themes = {
  light: lightColors,
  dark: darkColors,
} as const;

export type ThemeMode = 'light' | 'dark';

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 3,
  },
} as const;

export function glowShadow(color: string) {
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  } as const;
}
