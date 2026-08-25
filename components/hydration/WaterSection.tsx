import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format, parseISO } from 'date-fns';
import { Card } from '../ui/Card';
import { WaterRing } from './WaterRing';
import { QuickAddButtons } from './QuickAddButtons';
import { EmptyState } from '../ui/EmptyState';
import { IconButton } from '../ui/IconButton';
import { WaterLog } from '../../store/useHydrationStore';
import { useTheme } from '../../lib/ThemeProvider';
import { accents, spacing, fontSize, radius } from '../../lib/theme';

type WaterSectionProps = {
  currentMl: number;
  goalMl: number;
  todaysLogs: WaterLog[];
  onAdd: (ml: number) => void;
  onRemove: (id: string) => void;
  showQuickAdd?: boolean;
};

export function WaterSection({
  currentMl,
  goalMl,
  todaysLogs,
  onAdd,
  onRemove,
  showQuickAdd = true,
}: WaterSectionProps) {
  const { colors } = useTheme();

  return (
    <View>
      <Card style={styles.ringCard}>
        <WaterRing currentMl={currentMl} goalMl={goalMl} />
      </Card>

      {showQuickAdd && (
        <>
          <View style={{ height: spacing.md }} />
          <QuickAddButtons onAdd={onAdd} />
        </>
      )}
      <View style={{ height: spacing.lg }} />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Log</Text>
      {todaysLogs.length === 0 ? (
        <EmptyState
          icon="water-outline"
          title="No water logged"
          subtitle={
            showQuickAdd ? 'Use the buttons above to log your intake.' : 'Nothing logged this day.'
          }
          accentColor={accents.hydration}
        />
      ) : (
        <View>
          {todaysLogs.map((log) => (
            <View
              key={log.id}
              style={[
                styles.logRow,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text style={[styles.logAmount, { color: colors.text }]}>
                +{log.amountMl}ml
              </Text>
              <Text style={[styles.logTime, { color: colors.textMuted }]}>
                {format(parseISO(log.loggedAt), 'h:mm a')}
              </Text>
              <IconButton
                icon="close"
                size={16}
                onPress={() => onRemove(log.id)}
                backgroundColor="transparent"
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  ringCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: spacing.sm,
  },
  logAmount: {
    fontSize: fontSize.md,
    fontWeight: '600',
    flex: 1,
  },
  logTime: {
    fontSize: fontSize.sm,
    marginRight: spacing.sm,
  },
});
