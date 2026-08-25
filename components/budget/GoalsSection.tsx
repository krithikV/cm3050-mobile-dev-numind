import React, { useState } from 'react';
import { View } from 'react-native';
import { EmptyState } from '../ui/EmptyState';
import { GoalItem } from './GoalItem';
import { AddFundsForm } from './AddFundsForm';
import { GoalForm } from './GoalForm';
import { SavingsGoal } from '../../store/useBudgetStore';
import { accents } from '../../lib/theme';

type GoalsSectionProps = {
  goals: SavingsGoal[];
  onContribute: (id: string, amount: number) => void;
  onUpdate: (
    id: string,
    updates: { name: string; targetAmount: number; targetDate: string | null }
  ) => void;
  onDelete: (id: string) => void;
};

export function GoalsSection({ goals, onContribute, onUpdate, onDelete }: GoalsSectionProps) {
  const [fundingGoal, setFundingGoal] = useState<SavingsGoal | null>(null);
  const [editingGoal, setEditingGoal] = useState<SavingsGoal | null>(null);

  if (goals.length === 0) {
    return (
      <EmptyState
        icon="trophy-outline"
        title="No savings goals yet"
        subtitle="Tap the + button to create one."
        accentColor={accents.budget}
      />
    );
  }

  return (
    <View>
      {goals.map((g) => (
        <GoalItem
          key={g.id}
          goal={g}
          onAddFunds={() => setFundingGoal(g)}
          onEdit={() => setEditingGoal(g)}
          onDelete={() => onDelete(g.id)}
        />
      ))}

      <AddFundsForm
        visible={fundingGoal !== null}
        goalName={fundingGoal?.name ?? null}
        onClose={() => setFundingGoal(null)}
        onSubmit={(amount) => {
          if (fundingGoal) onContribute(fundingGoal.id, amount);
        }}
      />

      <GoalForm
        key={editingGoal?.id ?? 'edit-none'}
        visible={editingGoal !== null}
        initial={editingGoal}
        onClose={() => setEditingGoal(null)}
        onSubmit={(input) => {
          if (editingGoal) onUpdate(editingGoal.id, input);
        }}
      />
    </View>
  );
}
