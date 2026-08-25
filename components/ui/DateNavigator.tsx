import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconButton } from './IconButton';
import { useTheme } from '../../lib/ThemeProvider';
import { spacing, fontSize } from '../../lib/theme';

type DateNavigatorProps = {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
};

export function DateNavigator({ label, onPrev, onNext, nextDisabled }: DateNavigatorProps) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <IconButton icon="chevron-back" onPress={onPrev} backgroundColor="transparent" />
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <IconButton
        icon="chevron-forward"
        onPress={onNext}
        backgroundColor="transparent"
        disabled={nextDisabled}
        color={nextDisabled ? colors.border : colors.text}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '700',
    marginHorizontal: spacing.md,
  },
});
