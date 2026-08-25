import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { format, addMonths } from 'date-fns';
import { Screen } from '../../components/ui/Screen';
import { SegmentedControl } from '../../components/ui/SegmentedControl';
import { FAB } from '../../components/ui/FAB';
import { DateNavigator } from '../../components/ui/DateNavigator';
import { OverviewSection } from '../../components/budget/OverviewSection';
import { TransactionsSection } from '../../components/budget/TransactionsSection';
import { BudgetsSection } from '../../components/budget/BudgetsSection';
import { GoalsSection } from '../../components/budget/GoalsSection';
import { TransactionForm } from '../../components/budget/TransactionForm';
import { CategoryManager } from '../../components/budget/CategoryManager';
import { GoalForm } from '../../components/budget/GoalForm';
import {
  useBudgetStore,
  transactionsForMonth,
  monthSummary,
  categoryBreakdown,
  categoryBudgetStatus,
  overallBudgetStatus,
  monthlyTotals,
  Transaction,
} from '../../store/useBudgetStore';
import { accents, spacing } from '../../lib/theme';

type Section = 'overview' | 'transactions' | 'budgets' | 'goals';

export default function BudgetScreen() {
  const transactions = useBudgetStore((s) => s.transactions);
  const categories = useBudgetStore((s) => s.categories);
  const categoryBudgets = useBudgetStore((s) => s.categoryBudgets);
  const overallBudget = useBudgetStore((s) => s.overallBudget);
  const savingsGoals = useBudgetStore((s) => s.savingsGoals);

  const addTransaction = useBudgetStore((s) => s.addTransaction);
  const updateTransaction = useBudgetStore((s) => s.updateTransaction);
  const deleteTransaction = useBudgetStore((s) => s.deleteTransaction);
  const syncRecurringTransactions = useBudgetStore((s) => s.syncRecurringTransactions);
  const addCategory = useBudgetStore((s) => s.addCategory);
  const renameCategory = useBudgetStore((s) => s.renameCategory);
  const deleteCategory = useBudgetStore((s) => s.deleteCategory);
  const setCategoryBudget = useBudgetStore((s) => s.setCategoryBudget);
  const removeCategoryBudget = useBudgetStore((s) => s.removeCategoryBudget);
  const setOverallBudget = useBudgetStore((s) => s.setOverallBudget);
  const addGoal = useBudgetStore((s) => s.addGoal);
  const updateGoal = useBudgetStore((s) => s.updateGoal);
  const deleteGoal = useBudgetStore((s) => s.deleteGoal);
  const contributeToGoal = useBudgetStore((s) => s.contributeToGoal);

  useEffect(() => {
    syncRecurringTransactions();
  }, [syncRecurringTransactions]);

  const [section, setSection] = useState<Section>('overview');
  const [monthOffset, setMonthOffset] = useState(0);
  const [txFormVisible, setTxFormVisible] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [categoryManagerVisible, setCategoryManagerVisible] = useState(false);
  const [goalFormVisible, setGoalFormVisible] = useState(false);

  const selectedDate = addMonths(new Date(), monthOffset);
  const yyyyMM = format(selectedDate, 'yyyy-MM');

  const summary = useMemo(() => monthSummary(transactions, yyyyMM), [transactions, yyyyMM]);
  const breakdown = useMemo(
    () => categoryBreakdown(transactions, yyyyMM),
    [transactions, yyyyMM]
  );
  const trend = useMemo(() => monthlyTotals(transactions, 6), [transactions]);
  const catStatus = useMemo(
    () => categoryBudgetStatus(breakdown, categoryBudgets),
    [breakdown, categoryBudgets]
  );
  const overallStatus = useMemo(
    () => overallBudgetStatus(transactions, overallBudget, yyyyMM),
    [transactions, overallBudget, yyyyMM]
  );
  const monthTx = useMemo(
    () => transactionsForMonth(transactions, yyyyMM),
    [transactions, yyyyMM]
  );
  // Expense and income can share a category name (e.g. both have "Other"),
  // so dedupe before handing this to a component that keys chips by name.
  const categoryNames = useMemo(
    () => Array.from(new Set(categories.map((c) => c.name))),
    [categories]
  );
  const expenseCategoryNames = useMemo(
    () => categories.filter((c) => c.type === 'expense').map((c) => c.name),
    [categories]
  );

  const openNewTransaction = () => {
    setEditingTx(null);
    setTxFormVisible(true);
  };

  const openEditTransaction = (tx: Transaction) => {
    setEditingTx(tx);
    setTxFormVisible(true);
  };

  return (
    <Screen
      title="Budget"
      subtitle="Set budgets, log spending & save"
      floatingAction={
        <>
          {(section === 'overview' || section === 'transactions') && (
            <FAB color={accents.budget} onPress={openNewTransaction} />
          )}
          {section === 'goals' && (
            <FAB color={accents.budget} onPress={() => setGoalFormVisible(true)} />
          )}
        </>
      }
    >
      <DateNavigator
        label={format(selectedDate, 'MMMM yyyy')}
        onPrev={() => setMonthOffset((o) => o - 1)}
        onNext={() => setMonthOffset((o) => Math.min(0, o + 1))}
        nextDisabled={monthOffset === 0}
      />

      <SegmentedControl
        segments={[
          { label: 'Overview', value: 'overview' },
          { label: 'Transactions', value: 'transactions' },
          { label: 'Budgets', value: 'budgets' },
          { label: 'Goals', value: 'goals' },
        ]}
        value={section}
        onChange={(v) => setSection(v as Section)}
        accentColor={accents.budget}
      />
      <View style={{ height: spacing.md }} />

      {section === 'overview' && (
        <OverviewSection
          income={summary.income}
          expenses={summary.expenses}
          remaining={summary.remaining}
          overallBudget={overallStatus}
          breakdown={breakdown}
          trend={trend}
        />
      )}

      {section === 'transactions' && (
        <TransactionsSection
          transactions={monthTx}
          categoryNames={categoryNames}
          onEdit={openEditTransaction}
          onDelete={deleteTransaction}
        />
      )}

      {section === 'budgets' && (
        <BudgetsSection
          expenseCategoryNames={expenseCategoryNames}
          categoryBudgets={categoryBudgets}
          categoryStatus={catStatus}
          overallBudget={overallBudget}
          onSaveOverallBudget={setOverallBudget}
          onSaveCategoryBudget={setCategoryBudget}
          onRemoveCategoryBudget={removeCategoryBudget}
          onManageCategories={() => setCategoryManagerVisible(true)}
        />
      )}

      {section === 'goals' && (
        <GoalsSection
          goals={savingsGoals}
          onContribute={contributeToGoal}
          onUpdate={updateGoal}
          onDelete={deleteGoal}
        />
      )}

      <TransactionForm
        key={editingTx?.id ?? 'new'}
        visible={txFormVisible}
        onClose={() => {
          setTxFormVisible(false);
          setEditingTx(null);
        }}
        categories={categories}
        initial={editingTx}
        onSubmit={(input) => {
          if (editingTx) {
            updateTransaction(editingTx.id, input);
          } else {
            addTransaction(input);
          }
        }}
      />

      <CategoryManager
        visible={categoryManagerVisible}
        onClose={() => setCategoryManagerVisible(false)}
        categories={categories}
        onAdd={addCategory}
        onRename={renameCategory}
        onDelete={deleteCategory}
      />

      <GoalForm
        visible={goalFormVisible}
        onClose={() => setGoalFormVisible(false)}
        onSubmit={addGoal}
      />
    </Screen>
  );
}

