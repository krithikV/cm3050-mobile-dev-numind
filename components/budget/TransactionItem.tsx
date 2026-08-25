import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { useTheme } from '../../lib/ThemeProvider';
import { radius, spacing, fontSize, accents } from '../../lib/theme';
import { formatCurrency } from '../../lib/format';
import { Transaction } from '../../store/useBudgetStore';

type TransactionItemProps = {
  transaction: Transaction;
  onDelete: () => void;
  onPress?: () => void;
};

export function TransactionItem({ transaction, onDelete, onPress }: TransactionItemProps) {
  const { colors } = useTheme();
  const isIncome = transaction.type === 'income';

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
      <Pressable
        onPress={onPress}
        style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: (isIncome ? accents.tasks : accents.budget) + '22' },
          ]}
        >
          <Ionicons
            name={isIncome ? 'arrow-down-outline' : 'arrow-up-outline'}
            size={18}
            color={isIncome ? accents.tasks : accents.budget}
          />
        </View>
        <View style={styles.textWrap}>
          <View style={styles.categoryRow}>
            <Text style={[styles.category, { color: colors.text }]}>
              {transaction.category}
            </Text>
            {transaction.recurring && (
              <Ionicons
                name="repeat"
                size={13}
                color={colors.textMuted}
                style={styles.recurringIcon}
              />
            )}
          </View>
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            {format(parseISO(transaction.date), 'MMM d')}
            {transaction.note ? ` · ${transaction.note}` : ''}
          </Text>
        </View>
        <Text
          style={[
            styles.amount,
            { color: isIncome ? accents.tasks : colors.text },
          ]}
        >
          {isIncome ? '+' : '-'}
          {formatCurrency(transaction.amount)}
        </Text>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  textWrap: {
    flex: 1,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  category: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  recurringIcon: {
    marginLeft: spacing.xs,
  },
  meta: {
    fontSize: fontSize.xs,
    marginTop: 2,
  },
  amount: {
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 64,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
  },
});
