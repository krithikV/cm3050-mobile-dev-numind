import {
  useBudgetStore,
  transactionsForMonth,
  monthSummary,
  categoryBreakdown,
  categoryBudgetStatus,
  overallBudgetStatus,
  monthlyTotals,
  dueRecurringInstances,
  Transaction,
  DEFAULT_CATEGORIES,
} from '../store/useBudgetStore';

const tx = (overrides: Partial<Transaction>): Transaction => ({
  id: Math.random().toString(),
  type: 'expense',
  amount: 10,
  category: 'Food',
  note: '',
  date: '2026-03-01',
  createdAt: '',
  recurring: false,
  recurringSourceId: null,
  ...overrides,
});

function resetStore() {
  useBudgetStore.setState({
    transactions: [],
    categories: DEFAULT_CATEGORIES,
    categoryBudgets: [],
    overallBudget: null,
    savingsGoals: [],
  });
}

describe('useBudgetStore — transactions', () => {
  beforeEach(resetStore);

  it('adds a transaction', () => {
    useBudgetStore.getState().addTransaction({
      type: 'expense',
      amount: 20,
      category: 'Food',
      note: 'Lunch',
      date: '2026-03-01',
    });
    expect(useBudgetStore.getState().transactions).toHaveLength(1);
    expect(useBudgetStore.getState().transactions[0].recurring).toBe(false);
  });

  it('updates a transaction', () => {
    useBudgetStore.getState().addTransaction({
      type: 'expense',
      amount: 20,
      category: 'Food',
      note: '',
      date: '2026-03-01',
    });
    const id = useBudgetStore.getState().transactions[0].id;
    useBudgetStore.getState().updateTransaction(id, { amount: 35, category: 'Bills' });
    const updated = useBudgetStore.getState().transactions[0];
    expect(updated.amount).toBe(35);
    expect(updated.category).toBe('Bills');
  });

  it('deletes a transaction', () => {
    useBudgetStore.getState().addTransaction({
      type: 'expense',
      amount: 20,
      category: 'Food',
      note: '',
      date: '2026-03-01',
    });
    const id = useBudgetStore.getState().transactions[0].id;
    useBudgetStore.getState().deleteTransaction(id);
    expect(useBudgetStore.getState().transactions).toHaveLength(0);
  });
});

describe('useBudgetStore — categories', () => {
  beforeEach(resetStore);

  it('seeds default categories', () => {
    expect(useBudgetStore.getState().categories.length).toBe(10);
  });

  it('adds a category, ignoring duplicates', () => {
    useBudgetStore.getState().addCategory('Health', 'expense');
    useBudgetStore.getState().addCategory('Health', 'expense');
    const matches = useBudgetStore
      .getState()
      .categories.filter((c) => c.name === 'Health' && c.type === 'expense');
    expect(matches).toHaveLength(1);
  });

  it('renames a category and cascades to existing transactions and budgets', () => {
    useBudgetStore.getState().addTransaction({
      type: 'expense',
      amount: 20,
      category: 'Food',
      note: '',
      date: '2026-03-01',
    });
    useBudgetStore.getState().setCategoryBudget('Food', 200);

    useBudgetStore.getState().renameCategory('Food', 'expense', 'Groceries');

    expect(
      useBudgetStore.getState().categories.some((c) => c.name === 'Groceries')
    ).toBe(true);
    expect(useBudgetStore.getState().transactions[0].category).toBe('Groceries');
    expect(useBudgetStore.getState().categoryBudgets[0].category).toBe('Groceries');
  });

  it('deletes a category from the list only, leaving past transactions untouched', () => {
    useBudgetStore.getState().addTransaction({
      type: 'expense',
      amount: 20,
      category: 'Food',
      note: '',
      date: '2026-03-01',
    });
    useBudgetStore.getState().deleteCategory('Food', 'expense');

    expect(
      useBudgetStore.getState().categories.some((c) => c.name === 'Food' && c.type === 'expense')
    ).toBe(false);
    expect(useBudgetStore.getState().transactions[0].category).toBe('Food');
  });
});

describe('transactionsForMonth', () => {
  it('filters by yyyy-MM prefix', () => {
    const transactions = [tx({ date: '2026-03-05' }), tx({ date: '2026-04-01' })];
    expect(transactionsForMonth(transactions, '2026-03')).toHaveLength(1);
  });
});

describe('monthSummary', () => {
  it('computes income, expenses, and remaining', () => {
    const transactions = [
      tx({ type: 'income', amount: 1000, date: '2026-03-01' }),
      tx({ type: 'expense', amount: 300, date: '2026-03-05' }),
      tx({ type: 'expense', amount: 100, date: '2026-03-10' }),
      tx({ type: 'expense', amount: 999, date: '2026-04-01' }), // different month
    ];
    const summary = monthSummary(transactions, '2026-03');
    expect(summary.income).toBe(1000);
    expect(summary.expenses).toBe(400);
    expect(summary.remaining).toBe(600);
  });
});

describe('categoryBreakdown', () => {
  it('sums expenses per category, sorted descending, excluding income', () => {
    const transactions = [
      tx({ type: 'expense', category: 'Food', amount: 50, date: '2026-03-01' }),
      tx({ type: 'expense', category: 'Food', amount: 25, date: '2026-03-02' }),
      tx({ type: 'expense', category: 'Transport', amount: 90, date: '2026-03-03' }),
      tx({ type: 'income', category: 'Salary', amount: 5000, date: '2026-03-01' }),
    ];
    const breakdown = categoryBreakdown(transactions, '2026-03');
    expect(breakdown).toEqual([
      { category: 'Transport', amount: 90 },
      { category: 'Food', amount: 75 },
    ]);
  });
});

describe('categoryBudgetStatus', () => {
  it('reports spent/remaining per capped category', () => {
    const transactions = [
      tx({ category: 'Food', amount: 80, date: '2026-03-01' }),
      tx({ category: 'Transport', amount: 40, date: '2026-03-01' }),
    ];
    const breakdown = categoryBreakdown(transactions, '2026-03');
    const status = categoryBudgetStatus(breakdown, [{ category: 'Food', limitAmount: 100 }]);
    expect(status).toEqual([{ category: 'Food', limit: 100, spent: 80, remaining: 20 }]);
  });

  it('reports negative remaining when over budget', () => {
    const transactions = [tx({ category: 'Food', amount: 150, date: '2026-03-01' })];
    const breakdown = categoryBreakdown(transactions, '2026-03');
    const status = categoryBudgetStatus(breakdown, [{ category: 'Food', limitAmount: 100 }]);
    expect(status[0].remaining).toBe(-50);
  });
});

describe('overallBudgetStatus', () => {
  it('returns null when no budget is set', () => {
    expect(overallBudgetStatus([], null, '2026-03')).toBeNull();
  });

  it('computes spent/remaining against expenses only', () => {
    const transactions = [
      tx({ type: 'income', amount: 1000, date: '2026-03-01' }),
      tx({ type: 'expense', amount: 300, date: '2026-03-05' }),
    ];
    const status = overallBudgetStatus(transactions, 500, '2026-03');
    expect(status).toEqual({ limit: 500, spent: 300, remaining: 200 });
  });
});

describe('monthlyTotals', () => {
  it('returns n months ending with the current month', () => {
    const totals = monthlyTotals([], 3);
    expect(totals).toHaveLength(3);
    const currentYyyyMM = totals[2].yyyyMM;
    expect(currentYyyyMM).toBe(new Date().toISOString().slice(0, 7));
  });

  it('aggregates income/expenses per month', () => {
    const currentYyyyMM = new Date().toISOString().slice(0, 7);
    const transactions = [
      tx({ type: 'income', amount: 500, date: `${currentYyyyMM}-01` }),
      tx({ type: 'expense', amount: 200, date: `${currentYyyyMM}-02` }),
    ];
    const totals = monthlyTotals(transactions, 3);
    const current = totals[totals.length - 1];
    expect(current.income).toBe(500);
    expect(current.expenses).toBe(200);
  });
});

describe('dueRecurringInstances', () => {
  it('generates no clone for a root already in the current month', () => {
    const today = new Date();
    const currentYyyyMM = today.toISOString().slice(0, 7);
    const transactions = [
      tx({ recurring: true, recurringSourceId: null, date: `${currentYyyyMM}-01` }),
    ];
    expect(dueRecurringInstances(transactions, today)).toHaveLength(0);
  });

  it('generates a clone once the due day has passed and none exists yet', () => {
    const today = new Date(2026, 2, 15); // March 15, 2026
    const transactions = [
      tx({
        id: 'root-1',
        recurring: true,
        recurringSourceId: null,
        date: '2026-02-10', // due on the 10th, before today's the 15th
      }),
    ];
    const generated = dueRecurringInstances(transactions, today);
    expect(generated).toHaveLength(1);
    expect(generated[0].recurringSourceId).toBe('root-1');
    expect(generated[0].date).toBe('2026-03-10');
  });

  it('does not generate a clone before the due day arrives', () => {
    const today = new Date(2026, 2, 5); // March 5
    const transactions = [
      tx({ id: 'root-1', recurring: true, recurringSourceId: null, date: '2026-02-10' }),
    ];
    expect(dueRecurringInstances(transactions, today)).toHaveLength(0);
  });

  it('does not duplicate a clone that already exists for the current month', () => {
    const today = new Date(2026, 2, 15);
    const transactions = [
      tx({ id: 'root-1', recurring: true, recurringSourceId: null, date: '2026-02-10' }),
      tx({ id: 'clone-1', recurring: true, recurringSourceId: 'root-1', date: '2026-03-10' }),
    ];
    expect(dueRecurringInstances(transactions, today)).toHaveLength(0);
  });
});

describe('useBudgetStore — savings goals', () => {
  beforeEach(resetStore);

  it('adds a goal', () => {
    useBudgetStore.getState().addGoal({
      name: 'Emergency fund',
      targetAmount: 1000,
      targetDate: null,
    });
    const goals = useBudgetStore.getState().savingsGoals;
    expect(goals).toHaveLength(1);
    expect(goals[0].savedAmount).toBe(0);
  });

  it('contributes to a goal', () => {
    useBudgetStore.getState().addGoal({
      name: 'Emergency fund',
      targetAmount: 1000,
      targetDate: null,
    });
    const id = useBudgetStore.getState().savingsGoals[0].id;
    useBudgetStore.getState().contributeToGoal(id, 150);
    useBudgetStore.getState().contributeToGoal(id, 50);
    expect(useBudgetStore.getState().savingsGoals[0].savedAmount).toBe(200);
  });

  it('deletes a goal', () => {
    useBudgetStore.getState().addGoal({
      name: 'Emergency fund',
      targetAmount: 1000,
      targetDate: null,
    });
    const id = useBudgetStore.getState().savingsGoals[0].id;
    useBudgetStore.getState().deleteGoal(id);
    expect(useBudgetStore.getState().savingsGoals).toHaveLength(0);
  });
});
