import React from 'react';
import { Pressable, StyleSheet, PressableProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../lib/ThemeProvider';
import { radius } from '../../lib/theme';

type IconButtonProps = Omit<PressableProps, 'style'> & {
  icon: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
};

export function IconButton({
  icon,
  size = 20,
  color,
  backgroundColor,
  ...rest
}: IconButtonProps) {
  const { colors } = useTheme();
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: backgroundColor ?? colors.surfaceAlt,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      hitSlop={8}
      {...rest}
    >
      <Ionicons name={icon as any} size={size} color={color ?? colors.text} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
