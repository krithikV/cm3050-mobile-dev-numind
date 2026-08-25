import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { radius } from '../../lib/theme';

type GlowIconBadgeProps = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number;
};

export function GlowIconBadge({ icon, color, size = 44 }: GlowIconBadgeProps) {
  return (
    <View
      style={[
        styles.badge,
        {
          width: size,
          height: size,
          borderRadius: radius.full,
          backgroundColor: color + '22',
        },
      ]}
    >
      <Ionicons name={icon} size={size * 0.5} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
