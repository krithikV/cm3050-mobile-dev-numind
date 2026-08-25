import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { BudgetBar } from './BudgetBar';
import { useTheme } from '../../lib/ThemeProvider';
import { accents, spacing, fontSize } from '../../lib/theme';
import { CategoryBudget } from '../../store/useBudgetStore';

type BudgetsSectionProps = {
  expenseCategoryNames: string[];
  categoryBudgets: CategoryBudget[];
  categoryStatus: { category: string; limit: number; spent: number; remaining: number }[];
  overallBudget: number | null;
  onSaveOverallBudget: (amount: number | null) => void;
  onSaveCategoryBudget: (category: string, limitAmount: number) => void;
  onRemoveCategoryBudget: (category: string) => void;
  onManageCategories: () => void;
};

export function BudgetsSection({
  expenseCategoryNames,
  categoryBudgets,
  categoryStatus,
  overallBudget,
  onSaveOverallBudget,
  onSaveCategoryBudget,
  onRemoveCategoryBudget,
  onManageCategories,
}: BudgetsSectionProps) {
  const { colors } = useTheme();
  const [overallInput, setOverallInput] = useState(
    overallBudget !== null ? String(overallBudget) : ''
  );
  const [categoryInputs, setCategoryInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    const initial: Record<string, string> = {};
    for (const name of expenseCategoryNames) {
      const existing = categoryBudgets.find((b) => b.category === name);
      initial[name] = existing ? String(existing.limitAmount) : '';
    }
    setCategoryInputs(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenseCategoryNames.join(',')]);

  const handleSaveAll = () => {
    const trimmedOverall = overallInput.trim();
    if (!trimmedOverall) {
      onSaveOverallBudget(null);
    } else {
      const overall = parseFloat(trimmedOverall);
      if (!Number.isNaN(overall) && overall > 0) {
        onSaveOverallBudget(overall);
      }
    }

    for (const [category, value] of Object.entries(categoryInputs)) {
      const trimmed = value.trim();
      if (!trimmed) {
        onRemoveCategoryBudget(category);
        continue;
      }
      const parsed = parseFloat(trimmed);
      if (!Number.isNaN(parsed) && parsed > 0) {
        onSaveCategoryBudget(category, parsed);
      }
    }
  };

  return (
    <View>
      <Card style={{ marginBottom: spacing.md }}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Overall monthly budget</Text>
        <Input
          placeholder="e.g. 2000"
          keyboardType="decimal-pad"
          value={overallInput}
          onChangeText={setOverallInput}
        />
      </Card>

      <Card style={{ marginBottom: spacing.md }}>
        <View style={styles.headerRow}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Category caps</Text>
          <Button label="Manage categories" variant="ghost" onPress={onManageCategories} />
        </View>
        {expenseCategoryNames.length === 0 ? (
          <Text style={{ color: colors.textMuted, fontSize: fontSize.sm }}>
            No expense categories yet.
          </Text>
        ) : (
          expenseCategoryNames.map((name) => (
            <Input
              key={name}
              label={name}
              placeholder="No limit set"
              keyboardType="decimal-pad"
              value={categoryInputs[name] ?? ''}
              onChangeText={(v) =>
                setCategoryInputs((prev) => ({ ...prev, [name]: v }))
              }
            />
          ))
        )}
        <Button
          label="Save budgets"
          accentColor={accents.budget}
          onPress={handleSaveAll}
          fullWidth
        />
      </Card>

      {categoryStatus.length > 0 && (
        <Card>
          <Text style={[styles.cardTitle, { color: colors.text }]}>This month's progress</Text>
          {categoryStatus.map((s) => (
            <BudgetBar key={s.category} label={s.category} spent={s.spent} limit={s.limit} />
          ))}
        </Card>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
