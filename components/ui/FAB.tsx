import React from 'react';
import { Pressable, StyleSheet, PressableProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius, glowShadow } from '../../lib/theme';
import { contrastText } from '../../lib/color';

type FABProps = Omit<PressableProps, 'style'> & {
  icon?: keyof typeof Ionicons.glyphMap;
  color: string;
};

export function FAB({ icon = 'add', color, ...rest }: FABProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.base,
        glowShadow(color),
        { backgroundColor: color, opacity: pressed ? 0.9 : 1 },
      ]}
      hitSlop={8}
      {...rest}
    >
      <Ionicons name={icon} size={28} color={contrastText(color)} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
