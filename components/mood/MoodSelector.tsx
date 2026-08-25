import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../lib/ThemeProvider';
import { radius, spacing, fontSize, accents } from '../../lib/theme';

const MOODS: { score: number; emoji: string; label: string }[] = [
  { score: 1, emoji: '😞', label: 'Awful' },
  { score: 2, emoji: '😕', label: 'Low' },
  { score: 3, emoji: '😐', label: 'Okay' },
  { score: 4, emoji: '🙂', label: 'Good' },
  { score: 5, emoji: '😄', label: 'Great' },
];

type MoodSelectorProps = {
  value: number | null;
  onChange: (score: number) => void;
};

export function MoodSelector({ value, onChange }: MoodSelectorProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {MOODS.map((m) => {
        const selected = value === m.score;
        return (
          <Pressable
            key={m.score}
            onPress={() => onChange(m.score)}
            style={[
              styles.item,
              {
                backgroundColor: selected ? accents.mood + '22' : colors.surfaceAlt,
                borderColor: selected ? accents.mood : 'transparent',
              },
            ]}
          >
            <Text style={styles.emoji}>{m.emoji}</Text>
            <Text
              style={[
                styles.label,
                { color: selected ? accents.mood : colors.textMuted },
              ]}
            >
              {m.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    marginHorizontal: 3,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  emoji: {
    fontSize: 26,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginTop: 4,
  },
});
