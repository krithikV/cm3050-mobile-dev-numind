import React from 'react';
import { fireEvent, screen } from '@testing-library/react-native';
import { renderWithTheme } from '../testUtils';
import { TransactionItem } from '../../components/budget/TransactionItem';
import { Transaction } from '../../store/useBudgetStore';

const baseTransaction: Transaction = {
  id: '1',
  type: 'expense',
  amount: 20,
  category: 'Food',
  note: '',
  date: '2026-03-05',
  createdAt: '2026-03-05T00:00:00.000Z',
  recurring: false,
  recurringSourceId: null,
};

describe('TransactionItem', () => {
  it('renders the category and a negative amount for an expense', () => {
    renderWithTheme(<TransactionItem transaction={baseTransaction} onDelete={() => {}} />);
    expect(screen.getByText('Food')).toBeTruthy();
    expect(screen.getByText('-$20.00')).toBeTruthy();
  });

  it('renders a positive amount for income', () => {
    renderWithTheme(
      <TransactionItem
        transaction={{ ...baseTransaction, type: 'income', amount: 500, category: 'Salary' }}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText('+$500.00')).toBeTruthy();
  });

  it('includes the note in the meta text when present', () => {
    renderWithTheme(
      <TransactionItem
        transaction={{ ...baseTransaction, note: 'Lunch with friends' }}
        onDelete={() => {}}
      />
    );
    expect(screen.getByText(/Lunch with friends/)).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const onPress = jest.fn();
    renderWithTheme(
      <TransactionItem transaction={baseTransaction} onDelete={() => {}} onPress={onPress} />
    );
    fireEvent.press(screen.getByText('Food'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
