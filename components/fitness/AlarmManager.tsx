import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Sheet } from '../ui/Sheet';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useTheme } from '../../lib/ThemeProvider';
import { spacing, fontSize, accents, radius } from '../../lib/theme';
import { Alarm } from '../../store/useAlarmsStore';

function formatTime(hour: number, minute: number): string {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
}

type AlarmManagerProps = {
  visible: boolean;
  onClose: () => void;
  alarms: Alarm[];
  onAdd: (input: { label: string; hour: number; minute: number }) => void;
  onToggle: (id: string, enabled: boolean) => void;
  onDelete: (id: string) => void;
};

export function AlarmManager({
  visible,
  onClose,
  alarms,
  onAdd,
  onToggle,
  onDelete,
}: AlarmManagerProps) {
  const { colors } = useTheme();
  const [label, setLabel] = useState('');
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleAdd = () => {
    if (!label.trim()) return;
    onAdd({ label: label.trim(), hour: time.getHours(), minute: time.getMinutes() });
    setLabel('');
    setTime(new Date());
  };

  return (
    <Sheet visible={visible} onClose={onClose}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={[styles.heading, { color: colors.text }]}>Alarms</Text>
        <Text style={[styles.notice, { color: colors.textMuted }]}>
          Alarms show as an in-app alert while NuMind is open — they can't wake the app
          in the background.
        </Text>

        {alarms.map((a) => (
          <View
            key={a.id}
            style={[styles.row, { borderColor: colors.border, backgroundColor: colors.surfaceAlt }]}
          >
            <View style={styles.rowText}>
              <Text style={[styles.label, { color: colors.text }]}>{a.label}</Text>
              <Text style={[styles.time, { color: colors.textMuted }]}>
                {formatTime(a.hour, a.minute)}
              </Text>
            </View>
            <Switch
              value={a.enabled}
              onValueChange={(v) => onToggle(a.id, v)}
              trackColor={{ true: accents.fitness }}
            />
            <Pressable onPress={() => onDelete(a.id)} hitSlop={8} style={{ marginLeft: spacing.sm }}>
              <Ionicons name="trash-outline" size={18} color={colors.danger} />
            </Pressable>
          </View>
        ))}

        <View style={{ height: spacing.sm }} />
        <Input label="New alarm" placeholder="e.g. Walk break" value={label} onChangeText={setLabel} />

        <Pressable
          onPress={() => setShowPicker(true)}
          style={[styles.timePicker, { backgroundColor: colors.surfaceAlt, borderColor: colors.border }]}
        >
          <Ionicons name="time-outline" size={18} color={colors.text} />
          <Text style={[styles.timePickerLabel, { color: colors.text }]}>
            {formatTime(time.getHours(), time.getMinutes())}
          </Text>
        </Pressable>
        {showPicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, selected) => {
              setShowPicker(false);
              if (selected) setTime(selected);
            }}
          />
        )}

        <View style={{ height: spacing.md }} />
        <Button label="Add alarm" accentColor={accents.fitness} onPress={handleAdd} fullWidth />
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: fontSize.lg,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  notice: {
    fontSize: fontSize.sm,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm + 4,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.sm,
  },
  rowText: {
    flex: 1,
  },
  label: {
    fontSize: fontSize.md,
    fontWeight: '600',
  },
  time: {
    fontSize: fontSize.sm,
    marginTop: 2,
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginTop: spacing.xs,
  },
  timePickerLabel: {
    fontSize: fontSize.md,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});
