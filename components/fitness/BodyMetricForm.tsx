import React, { useState } from 'react';
import { Text } from 'react-native';
import { Sheet } from '../ui/Sheet';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { formStyles } from '../ui/formStyles';
import { useTheme } from '../../lib/ThemeProvider';
import { accents } from '../../lib/theme';
import { parsePositiveAmount } from '../../lib/format';

type BodyMetricFormProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (weightKg: number) => void;
};

export function BodyMetricForm({ visible, onClose, onSubmit }: BodyMetricFormProps) {
  const { colors } = useTheme();
  const [weight, setWeight] = useState('');

  const handleSubmit = () => {
    const parsed = parsePositiveAmount(weight);
    if (!parsed) return;
    onSubmit(parsed);
    setWeight('');
    onClose();
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <Text style={[formStyles.heading, { color: colors.text }]}>Log weight</Text>
      <Input
        label="Weight (kg)"
        placeholder="70"
        keyboardType="decimal-pad"
        value={weight}
        onChangeText={setWeight}
        autoFocus
      />
      <Button label="Save" accentColor={accents.hydration} onPress={handleSubmit} fullWidth />
    </Sheet>
  );
}
