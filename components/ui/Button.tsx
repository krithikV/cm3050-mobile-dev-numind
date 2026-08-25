import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  ActivityIndicator,
  PressableProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../lib/ThemeProvider';
import { radius, spacing, fontSize } from '../../lib/theme';
import { contrastText } from '../../lib/color';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: ButtonVariant;
  accentColor?: string;
  icon?: string;
  loading?: boolean;
  fullWidth?: boolean;
};

export function Button({
  label,
  variant = 'primary',
  accentColor,
  icon,
  loading,
  fullWidth,
  disabled,
  ...rest
}: ButtonProps) {
  const { colors } = useTheme();
  const tint = accentColor ?? colors.tasks;

  const backgroundColor =
    variant === 'primary'
      ? tint
      : variant === 'danger'
        ? colors.danger
        : variant === 'secondary'
          ? colors.surfaceAlt
          : 'transparent';

  const textColor =
    variant === 'primary'
      ? contrastText(tint)
      : variant === 'danger'
        ? contrastText(colors.danger)
        : colors.text;

  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor,
          opacity: pressed ? 0.85 : disabled ? 0.5 : 1,
          width: fullWidth ? '100%' : undefined,
          borderWidth: variant === 'ghost' ? StyleSheet.hairlineWidth : 0,
          borderColor: colors.border,
        },
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {icon && <Ionicons name={icon as any} size={18} color={textColor} style={styles.icon} />}
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  icon: {
    marginRight: spacing.xs,
  },
});
