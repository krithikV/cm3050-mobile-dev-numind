import React, { useMemo, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Input } from '../ui/Input';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Chip } from '../ui/Chip';
import { EmptyState } from '../ui/EmptyState';
import { TransactionItem } from './TransactionItem';
import { Transaction, TransactionType } from '../../store/useBudgetStore';
import { accents, spacing } from '../../lib/theme';

type TypeFilter = 'all' | TransactionType;

type TransactionsSectionProps = {
  transactions: Transaction[];
  categoryNames: string[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
};

export function TransactionsSection({
  transactions,
  categoryNames,
  onEdit,
  onDelete,
}: TransactionsSectionProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return transactions
      .filter((t) => typeFilter === 'all' || t.type === typeFilter)
      .filter((t) => !categoryFilter || t.category === categoryFilter)
      .filter(
        (t) =>
          !query ||
          t.category.toLowerCase().includes(query) ||
          t.note.toLowerCase().includes(query)
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [transactions, search, typeFilter, categoryFilter]);

  return (
    <View>
      <Input
        placeholder="Search by category or note"
        value={search}
        onChangeText={setSearch}
      />

      <SegmentedControl
        segments={[
          { label: 'All', value: 'all' },
          { label: 'Income', value: 'income' },
          { label: 'Expense', value: 'expense' },
        ]}
        value={typeFilter}
        onChange={(v) => setTypeFilter(v as TypeFilter)}
        accentColor={accents.budget}
      />

      <View style={{ height: spacing.sm }} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: spacing.xs, paddingBottom: spacing.md }}
      >
        <Chip
          label="All categories"
          selected={categoryFilter === null}
          accentColor={accents.budget}
          onPress={() => setCategoryFilter(null)}
        />
        {categoryNames.map((c) => (
          <Chip
            key={c}
            label={c}
            selected={categoryFilter === c}
            accentColor={accents.budget}
            onPress={() => setCategoryFilter(c === categoryFilter ? null : c)}
          />
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <EmptyState
          icon="search-outline"
          title="No matching transactions"
          subtitle="Try a different search or filter."
          accentColor={accents.budget}
        />
      ) : (
        <View>
          {filtered.map((t) => (
            <TransactionItem
              key={t.id}
              transaction={t}
              onPress={() => onEdit(t)}
              onDelete={() => onDelete(t.id)}
            />
          ))}
        </View>
      )}
    </View>
  );
}
