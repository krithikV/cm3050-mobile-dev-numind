import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storageKeys } from '../lib/storage';
import { dateKey } from '../lib/date';
import { newId } from '../lib/id';

export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note: string;
  date: string; // yyyy-MM-dd
  createdAt: string;
  recurring: boolean;
  recurringSourceId: string | null;
};

export type Category = {
  name: string;
  type: TransactionType;
};

export type CategoryBudget = {
  category: string;
  limitAmount: number;
};

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  targetDate: string | null; // yyyy-MM-dd
  savedAmount: number;
  createdAt: string;
};

export const DEFAULT_CATEGORIES: Category[] = [
  { name: 'Food', type: 'expense' },
  { name: 'Transport', type: 'expense' },
  { name: 'Bills', type: 'expense' },
  { name: 'Shopping', type: 'expense' },
  { name: 'Fun', type: 'expense' },
  { name: 'Other', type: 'expense' },
  { name: 'Salary', type: 'income' },
  { name: 'Gift', type: 'income' },
  { name: 'Freelance', type: 'income' },
  { name: 'Other', type: 'income' },
];

type BudgetState = {
  transactions: Transaction[];
  categories: Category[];
  categoryBudgets: CategoryBudget[];
  overallBudget: number | null;
  savingsGoals: SavingsGoal[];

  addTransaction: (
    input: Omit<Transaction, 'id' | 'createdAt' | 'recurring' | 'recurringSourceId'> & {
      recurring?: boolean;
    }
  ) => void;
  updateTransaction: (id: string, updates: Partial<Omit<Transaction, 'id'>>) => void;
  deleteTransaction: (id: string) => void;
  syncRecurringTransactions: () => void;

  addCategory: (name: string, type: TransactionType) => void;
  renameCategory: (oldName: string, type: TransactionType, newName: string) => void;
  deleteCategory: (name: string, type: TransactionType) => void;

  setCategoryBudget: (category: string, limitAmount: number) => void;
  removeCategoryBudget: (category: string) => void;
  setOverallBudget: (amount: number | null) => void;

  addGoal: (input: { name: string; targetAmount: number; targetDate: string | null }) => void;
  updateGoal: (
    id: string,
    updates: Partial<Pick<SavingsGoal, 'name' | 'targetAmount' | 'targetDate'>>
  ) => void;
  deleteGoal: (id: string) => void;
  contributeToGoal: (id: string, amount: number) => void;
};

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: DEFAULT_CATEGORIES,
      categoryBudgets: [],
      overallBudget: null,
      savingsGoals: [],

      addTransaction: (input) => {
        const tx: Transaction = {
          ...input,
          id: newId(),
          createdAt: new Date().toISOString(),
          recurring: input.recurring ?? false,
          recurringSourceId: null,
        };
        set({ transactions: [tx, ...get().transactions] });
      },

      updateTransaction: (id, updates) =>
        set({
          transactions: get().transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }),

      deleteTransaction: (id) =>
        set({ transactions: get().transactions.filter((t) => t.id !== id) }),

      syncRecurringTransactions: () => {
        const generated = dueRecurringInstances(get().transactions, new Date());
        if (generated.length > 0) {
          set({ transactions: [...generated, ...get().transactions] });
        }
      },

      addCategory: (name, type) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const exists = get().categories.some(
          (c) => c.name === trimmed && c.type === type
        );
        if (exists) return;
        set({ categories: [...get().categories, { name: trimmed, type }] });
      },

      renameCategory: (oldName, type, newName) => {
        const trimmed = newName.trim();
        if (!trimmed || trimmed === oldName) return;
        set({
          categories: get().categories.map((c) =>
            c.name === oldName && c.type === type ? { ...c, name: trimmed } : c
          ),
          transactions: get().transactions.map((t) =>
            t.category === oldName && t.type === type ? { ...t, category: trimmed } : t
          ),
          categoryBudgets: get().categoryBudgets.map((b) =>
            b.category === oldName ? { ...b, category: trimmed } : b
          ),
        });
      },

      deleteCategory: (name, type) =>
        set({
          categories: get().categories.filter(
            (c) => !(c.name === name && c.type === type)
          ),
        }),

      setCategoryBudget: (category, limitAmount) => {
        const existing = get().categoryBudgets.find((b) => b.category === category);
        if (existing) {
          set({
            categoryBudgets: get().categoryBudgets.map((b) =>
              b.category === category ? { ...b, limitAmount } : b
            ),
          });
        } else {
          set({
            categoryBudgets: [...get().categoryBudgets, { category, limitAmount }],
          });
        }
      },

      removeCategoryBudget: (category) =>
        set({
          categoryBudgets: get().categoryBudgets.filter((b) => b.category !== category),
        }),

      setOverallBudget: (amount) => set({ overallBudget: amount }),

      addGoal: (input) => {
        const goal: SavingsGoal = {
          ...input,
          id: newId(),
          savedAmount: 0,
          createdAt: new Date().toISOString(),
        };
        set({ savingsGoals: [goal, ...get().savingsGoals] });
      },

      updateGoal: (id, updates) =>
        set({
          savingsGoals: get().savingsGoals.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        }),

      deleteGoal: (id) =>
        set({ savingsGoals: get().savingsGoals.filter((g) => g.id !== id) }),

      contributeToGoal: (id, amount) =>
        set({
          savingsGoals: get().savingsGoals.map((g) =>
            g.id === id ? { ...g, savedAmount: g.savedAmount + amount } : g
          ),
        }),
    }),
    {
      name: storageKeys.budget,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function transactionsForMonth(transactions: Transaction[], yyyyMM: string) {
  return transactions.filter((t) => t.date.startsWith(yyyyMM));
}

export function monthSummary(transactions: Transaction[], yyyyMM: string) {
  const monthTx = transactionsForMonth(transactions, yyyyMM);
  const income = monthTx
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = monthTx
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expenses, remaining: income - expenses };
}

export function categoryBreakdown(transactions: Transaction[], yyyyMM: string) {
  const monthTx = transactionsForMonth(transactions, yyyyMM).filter(
    (t) => t.type === 'expense'
  );
  const totals = new Map<string, number>();
  for (const t of monthTx) {
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }
  return Array.from(totals.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function categoryBudgetStatus(
  breakdown: { category: string; amount: number }[],
  categoryBudgets: CategoryBudget[]
) {
  const spendByCategory = new Map(breakdown.map((c) => [c.category, c.amount]));
  return categoryBudgets.map((b) => {
    const spent = spendByCategory.get(b.category) ?? 0;
    return {
      category: b.category,
      limit: b.limitAmount,
      spent,
      remaining: b.limitAmount - spent,
    };
  });
}

export function overallBudgetStatus(
  transactions: Transaction[],
  overallBudget: number | null,
  yyyyMM: string
) {
  if (overallBudget === null) return null;
  const { expenses } = monthSummary(transactions, yyyyMM);
  return { limit: overallBudget, spent: expenses, remaining: overallBudget - expenses };
}

export function monthlyTotals(transactions: Transaction[], monthsBack: number) {
  const result: { yyyyMM: string; income: number; expenses: number }[] = [];
  const cursor = new Date();
  cursor.setDate(1);
  cursor.setMonth(cursor.getMonth() - (monthsBack - 1));
  for (let i = 0; i < monthsBack; i++) {
    const yyyyMM = dateKey(cursor).slice(0, 7);
    const summary = monthSummary(transactions, yyyyMM);
    result.push({ yyyyMM, income: summary.income, expenses: summary.expenses });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return result;
}

function lastDayOfMonth(year: number, monthIndex: number): number {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function dueRecurringInstances(
  transactions: Transaction[],
  today: Date
): Transaction[] {
  const currentYyyyMM = dateKey(today).slice(0, 7);
  const roots = transactions.filter((t) => t.recurring && !t.recurringSourceId);
  const generated: Transaction[] = [];

  for (const root of roots) {
    if (root.date.startsWith(currentYyyyMM)) continue; // root itself is this month's instance

    const alreadyLogged = transactions.some(
      (t) => t.recurringSourceId === root.id && t.date.startsWith(currentYyyyMM)
    );
    if (alreadyLogged) continue;

    const rootDay = parseInt(root.date.slice(8, 10), 10);
    const targetDay = Math.min(
      rootDay,
      lastDayOfMonth(today.getFullYear(), today.getMonth())
    );
    if (targetDay > today.getDate()) continue; // not due yet this month

    const instanceDate = new Date(today.getFullYear(), today.getMonth(), targetDay);
    generated.push({
      id: newId(),
      type: root.type,
      amount: root.amount,
      category: root.category,
      note: root.note,
      date: dateKey(instanceDate),
      createdAt: new Date().toISOString(),
      recurring: true,
      recurringSourceId: root.id,
    });
  }

  return generated;
}
