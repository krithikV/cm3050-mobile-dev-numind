import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlowIconBadge } from './GlowIconBadge';
import { Card } from './Card';
import { useTheme } from '../../lib/ThemeProvider';
import { radius, spacing, fontSize } from '../../lib/theme';

type ProgressRowProps = {
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  progress?: number; // 0..1, omit to hide the bar
  onPress: () => void;
};

export function ProgressRow({
  icon,
  color,
  title,
  subtitle,
  progress,
  onPress,
}: ProgressRowProps) {
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress}>
      <Card style={styles.row}>
        <GlowIconBadge icon={icon} color={color} />
        <View style={styles.textWrap}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]} numberOfLines={1}>
            {subtitle}
          </Text>
          {progress !== undefined && (
            <View style={[styles.track, { backgroundColor: colors.surfaceAlt }]}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.min(1, Math.max(0, progress)) * 100}%`,
                    backgroundColor: color,
                  },
                ]}
              />
            </View>
          )}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  textWrap: {
    flex: 1,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  track: {
    height: 6,
    borderRadius: radius.full,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
});
