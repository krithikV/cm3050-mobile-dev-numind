import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ProgressRing } from '../ui/ProgressRing';
import { Card } from '../ui/Card';
import { useTheme } from '../../lib/ThemeProvider';
import { spacing, fontSize, accents } from '../../lib/theme';
import { formatCurrency } from '../../lib/format';
import { SavingsGoal } from '../../store/useBudgetStore';

type GoalItemProps = {
  goal: SavingsGoal;
  onAddFunds: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function GoalItem({ goal, onAddFunds, onEdit, onDelete }: GoalItemProps) {
  const { colors } = useTheme();
  const progress = goal.targetAmount > 0 ? goal.savedAmount / goal.targetAmount : 0;

  return (
    <Swipeable
      renderRightActions={() => (
        <Pressable
          onPress={onDelete}
          style={[styles.deleteAction, { backgroundColor: colors.danger }]}
        >
          <Ionicons name="trash-outline" size={22} color="#fff" />
        </Pressable>
      )}
      overshootRight={false}
    >
      <Card style={styles.row}>
        <ProgressRing progress={progress} size={64} strokeWidth={7} color={accents.budget} />
        <Pressable style={styles.textWrap} onPress={onEdit}>
          <Text style={[styles.name, { color: colors.text }]}>{goal.name}</Text>
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            {formatCurrency(goal.savedAmount)} of {formatCurrency(goal.targetAmount)}
            {goal.targetDate ? ` · by ${format(parseISO(goal.targetDate), 'MMM d, yyyy')}` : ''}
          </Text>
        </Pressable>
        <Pressable
          onPress={onAddFunds}
          style={[styles.addButton, { backgroundColor: accents.budget + '22' }]}
        >
          <Ionicons name="add" size={20} color={accents.budget} />
        </Pressable>
      </Card>
    </Swipeable>
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
  name: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  meta: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    borderRadius: 24,
    marginBottom: spacing.sm,
  },
});
