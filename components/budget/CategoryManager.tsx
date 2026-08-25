import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Sheet } from '../ui/Sheet';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { SegmentedControl } from '../ui/SegmentedControl';
import { useTheme } from '../../lib/ThemeProvider';
import { spacing, fontSize, accents, radius } from '../../lib/theme';
import { Category, TransactionType } from '../../store/useBudgetStore';

type CategoryManagerProps = {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  onAdd: (name: string, type: TransactionType) => void;
  onRename: (oldName: string, type: TransactionType, newName: string) => void;
  onDelete: (name: string, type: TransactionType) => void;
};

export function CategoryManager({
  visible,
  onClose,
  categories,
  onAdd,
  onRename,
  onDelete,
}: CategoryManagerProps) {
  const { colors } = useTheme();
  const [type, setType] = useState<TransactionType>('expense');
  const [newName, setNewName] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const list = categories.filter((c) => c.type === type);

  const handleAdd = () => {
    if (!newName.trim()) return;
    onAdd(newName, type);
    setNewName('');
  };

  const startRename = (name: string) => {
    setRenamingId(name);
    setRenameValue(name);
  };

  const commitRename = () => {
    if (renamingId && renameValue.trim()) {
      onRename(renamingId, type, renameValue);
    }
    setRenamingId(null);
    setRenameValue('');
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: colors.text }]}>Manage categories</Text>

        <SegmentedControl
          segments={[
            { label: 'Expense', value: 'expense' },
            { label: 'Income', value: 'income' },
          ]}
          value={type}
          onChange={(v) => setType(v as TransactionType)}
          accentColor={accents.budget}
        />

        <View style={{ height: spacing.md }} />

        {list.map((c) => (
          <View
            key={c.name}
            style={[styles.row, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}
          >
            {renamingId === c.name ? (
              <Input
                value={renameValue}
                onChangeText={setRenameValue}
                onSubmitEditing={commitRename}
                autoFocus
                containerStyle={styles.renameInput}
              />
            ) : (
              <Text style={[styles.name, { color: colors.text }]}>{c.name}</Text>
            )}
            <View style={styles.actions}>
              {renamingId === c.name ? (
                <Pressable onPress={commitRename} hitSlop={8}>
                  <Ionicons name="checkmark" size={20} color={accents.tasks} />
                </Pressable>
              ) : (
                <Pressable onPress={() => startRename(c.name)} hitSlop={8}>
                  <Ionicons name="pencil-outline" size={18} color={colors.textMuted} />
                </Pressable>
              )}
              <Pressable onPress={() => onDelete(c.name, type)} hitSlop={8}>
                <Ionicons name="trash-outline" size={18} color={colors.danger} />
              </Pressable>
            </View>
          </View>
        ))}

        <View style={{ height: spacing.sm }} />
        <View style={styles.addRow}>
          <Input
            placeholder="New category name"
            value={newName}
            onChangeText={setNewName}
            onSubmitEditing={handleAdd}
            containerStyle={styles.addInput}
          />
        </View>
        <Button label="Add category" accentColor={accents.budget} onPress={handleAdd} fullWidth />
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm + 4,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: fontSize.md,
    fontWeight: '600',
    flex: 1,
  },
  renameInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  addRow: {
    marginTop: spacing.xs,
  },
  addInput: {
    marginBottom: spacing.sm,
  },
});
