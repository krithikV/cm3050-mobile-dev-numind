import React, { useState } from 'react';
import { Text } from 'react-native';
import { Sheet } from '../ui/Sheet';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { formStyles } from '../ui/formStyles';
import { useTheme } from '../../lib/ThemeProvider';
import { accents } from '../../lib/theme';
import { parsePositiveAmount } from '../../lib/format';

type AddFundsFormProps = {
  visible: boolean;
  goalName: string | null;
  onClose: () => void;
  onSubmit: (amount: number) => void;
};

export function AddFundsForm({ visible, goalName, onClose, onSubmit }: AddFundsFormProps) {
  const { colors } = useTheme();
  const [amount, setAmount] = useState('');

  const handleSubmit = () => {
    const parsed = parsePositiveAmount(amount);
    if (!parsed) return;
    onSubmit(parsed);
    setAmount('');
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text style={[formStyles.heading, { color: colors.text }]}>
        Add funds{goalName ? ` — ${goalName}` : ''}
      </Text>
      <Input
        label="Amount"
        placeholder="50"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
        autoFocus
      />
      <Button label="Add funds" accentColor={accents.budget} onPress={handleSubmit} fullWidth />
    </Sheet>
  );
}
